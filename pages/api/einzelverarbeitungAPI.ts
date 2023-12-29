import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import XLSX from 'xlsx';
import mongoose from 'mongoose';
import pLimit from 'p-limit';
import ExcerciseTemplate from '@/models/ExcerciseTemplate';
import { connectToDB } from '@/utils/connectToDB';
import setData from './db/saveDataBySchema';
import User from '@/models/User';
// import { sendProgress } from './progress';

export const config = {
  maxDuration: 300,
};

interface Exercise {
  exercise_id: string;
  exercise_text: string;
  solution_correct: string;
  rubric_scoring: string;
  points_achievable: number;
  points_achieved: number;
  aioutput: string;
  feedback: string;
  solution_student: string;
}

async function getExercisesFromBuffer(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  if (!workbook.SheetNames.length) throw new Error('No sheets found.');
  const wsname = workbook.SheetNames[0];
  const ws = workbook.Sheets[wsname];
  const exercises: Exercise[] = XLSX.utils.sheet_to_json(ws);
  return exercises;
}

function getRetryAfterDuration(error: any): number {
  const rateLimitReset = error.headers?.['x-ratelimit-reset-tokens'];
  if (rateLimitReset) {
    const match = rateLimitReset.match(/(\d+(\.\d+)?)s/); // Regex, um die Zahl aus dem String zu extrahieren.
    if (match) {
      const resetTimeInSeconds = parseFloat(match[1]);
      if (!isNaN(resetTimeInSeconds)) {
        const resetTimeInMilliseconds = resetTimeInSeconds * 1000;
        return resetTimeInMilliseconds;
      }
    }
  }
  // Standardverzögerung, wenn kein Header gefunden oder Parsing fehlgeschlagen
  return 5000; // Standardwert, z.B. 5 Sekunden in Millisekunden
}

async function retryOnFailure<T>(task: () => Promise<T>, retries = 5, initialDelay = 5000): Promise<T> {
  try {
    const result = await task();
    return result;
  } catch (error: any) {
    const waitTime = getRetryAfterDuration(error);

    if (retries > 0 && (error.status === 429 || error.code === 'rate_limit_exceeded')) {
      console.error(`Überschreitung des Ratenlimits, versuche erneut nach ${waitTime / 1000} Sekunden.`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return retryOnFailure(task, retries - 1, initialDelay * 2);
    } else {
      console.error("Keine weiteren Versuche oder anderer Fehler aufgetreten:", error);
      throw error;
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    const {solution_student, clerkId, schemaId } = req.body;  // Extrahieren Sie schemaId aus dem Request-Body

    const user = await User.findOne({ clerkId: clerkId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.usage >= user.maxUsage) {
      res.status(403).end();
      return;
    }


    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const excerciseTemplate = await ExcerciseTemplate.findById(schemaId);  // Verwenden Sie findById, um das spezifische Schema zu holen
    if (!excerciseTemplate) throw new Error('No excercise template found for the given ID.');

    const exercises = await getExercisesFromBuffer(excerciseTemplate.excelFile.buffer);
    const limit = pLimit(20);
    const tasks = exercises.map((exercise, index) => {
      if (!solution_student[index]) {
        return Promise.resolve(null);
      }

      let prompt = `
        Titel: ${exercise.exercise_id}, 
        Aufgabenstellung: ${exercise.exercise_text}, 
        Musterlösung: ${exercise.solution_correct},
        Korrekturschlüssel: ${exercise.rubric_scoring} 
        Maximal ereichbare Punkte: ${exercise.points_achievable}, 
        Studentenlösung: ${solution_student[index]}`;

      return limit(() =>
        new Promise((resolve, reject) =>
          setTimeout(() => {
            const task = async () => {
              const response = await openai.chat.completions.create({
                messages: [
                  { role: 'system', content: `${excerciseTemplate.systemprompt}` },
                  { role: 'user', content: `${prompt}` },
                ],
                model: "gpt-4",
                temperature: 0,
              });
              resolve(response);
            };
            // Statt setTimeout, rufen Sie task direkt in retryOnFailure auf
            retryOnFailure(() => task()).catch((error) => {
              console.error(`Fehler bei der Anfrage an OpenAI für Aufgabe: ${exercise.exercise_id}: `, error);
            });

          }, index * 200)
        )
      );
    });

    // Extrahieren der Punktzahl und des Feedbacks
    const extractPunktzahl = (response: string) => {
      const match = response.match(/⌘(.*?)⌘/);
      return match ? match[1].trim() : null;
    };

    const extractFeedback = (response: string) => {
      let feedback = response.replace(/⌘([\s\S]?)⌘/, '').replace(/⌘/g, '').trim();
      return feedback;
    };


    // Falls NaN ersetzen zu 0 
    function ensureNumber(value: string) {
      const number = parseInt(value, 10);
      return isNaN(number) ? 0 : number;
    }


    try {
      const resArr = await Promise.all(tasks);

      // Werte auf 0 setzen
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let grandTotalAchievablePoints = 0;
      let grandTotalPoints = 0;

      const results: string[] = [];

      resArr.forEach((response, index) => {
        if (!response) return;
        const aioutput = response.choices[0]?.message.content ?? 'No response';

        // Übergabe der Punktzahl und des Feedbacks aus Extraktion
        const pointsAchieved = extractPunktzahl(aioutput);
        const feedback = extractFeedback(aioutput);


        // -------------- 4 Variabelen in Excel Datei hinzufügen -------------


        exercises[index].solution_student = solution_student[index];

        exercises[index].points_achieved = ensureNumber(pointsAchieved || '0');

        exercises[index].feedback = feedback;

        exercises[index].aioutput = aioutput;

        // -------------- Token erfassen und addieren ---------------

        // Input und Output Token erfassen
        const tokensUsed = response['usage']['completion_tokens'];
        const inputTokensUsed = response['usage']['prompt_tokens'];

        // Token aller Anfragen summieren
        totalOutputTokens += tokensUsed;
        totalInputTokens += inputTokensUsed;

        // -------------- Punktzahl erfassen und addieren --------------
        grandTotalAchievablePoints += exercises[index].points_achievable;
        grandTotalPoints += exercises[index].points_achieved;


        //Output
        results.push(aioutput);
      });

      user.usage += 1;
      await user.save();

      // -------------- Excel Datei im buffer Speichern --------------
      const newWs = XLSX.utils.json_to_sheet(exercises);
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, newWs);
      const excelBuffer = XLSX.write(newWb, { type: 'buffer', bookType: 'xlsx' });


      // -------------- Preis ausrechen und in String umwandeln--------------
      const inputTokenCostMultiplier = 0.03 / 1000; // $0.03 pro 1K Tokens
      const outputTokenCostMultiplier = 0.06 / 1000; // $0.06 pro 1K Tokens

      const totalInputCost = totalInputTokens * inputTokenCostMultiplier;
      const totalOutputCost = totalOutputTokens * outputTokenCostMultiplier;
      const totalCost = totalInputCost + totalOutputCost;

      const totalCostString = totalCost;


      // Abrufen der Daten aus req.body
      const clerkId = req.body.clerkId;
      const username = req.body.username;
      const schemaName = req.body.schemaName;
      const schemaId = req.body.schemaId;

      // Senden der einzelnen Komponenten MongoDB
      const apiReq = {
        body: {
          excelBuffer,
          clerkId,
          username,
          schemaName,
          schemaId,
          totalCosts: totalCostString,
          grandTotalPoints: grandTotalPoints.toString(),
          grandTotalAchievablePoints: grandTotalAchievablePoints.toString(),

        },
        headers: { 'Content-Type': 'application/json' },
      } as unknown as NextApiRequest;

      const apiRes = {
        status: function (statusCode: number) {
          return this;
        },
        json: function (data: any) {
        },
      } as NextApiResponse;

      await setData(apiReq, apiRes);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(results.join('\n\n'));
    }
    catch (error) {
      console.error('Error during API handler:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  catch (err) {
    if (mongoose.connection.readyState) mongoose.connection.close();
    console.error('Error during API handler:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}