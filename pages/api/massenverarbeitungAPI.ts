import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import XLSX from 'xlsx';
import pLimit from 'p-limit';
import buffer from 'buffer';

interface Exercise {
  exercise_id: string;
  exercise_text: string;
  solution_correct: string;
  rubric_scoring: string;
  points_achievable: number;
  solution_student: string;
  correction: string;
  points_achieved: string;
  feedback: string;
  systemprompt: string;
}

const extractPunktzahl = (response: string) => {
  const match = response.match(/\$\$\$([\s\S]*?)\$\$\$/);
  return match ? match[1].trim() : null;
};


const extractFeedback = (response: string) => {
  const match = response.match(/###([\s\S]*?)###/);
  return match ? match[1].trim() : null;
};


const MAX_RETRIES = 20;
const INITIAL_RETRY_DELAY = 1500;
async function retryOnError<T>(
  func: () => Promise<T>,
  retriesLeft: number = MAX_RETRIES,
  delay: number = INITIAL_RETRY_DELAY,
): Promise<T> {
  try {
    return await func();
  } catch (error) {
    //@ts-ignore
    if (retriesLeft <= 1 || error.response.statusCode !== 503) throw error;

    await new Promise(res => setTimeout(res, delay));
    return retryOnError(func, retriesLeft - 1, delay * 2);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { model, exercises, systemprompt } = req.body; // exercises und systemprompt aus dem Request Body entnehmen

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const limit = pLimit(20); // Parallelität auf 10 beschränken, um Rate-Limits zu vermeiden
    const tasks = exercises.map((exercise: Exercise) => {
      let prompt = `
        Aufgabe: ${exercise.exercise_id}, 
        Aufgabenstellung: ${exercise.exercise_text}, 
        Musterlösung: ${exercise.solution_correct}, 
        Maximal ereichbare Punkte: ${exercise.points_achievable}, 
        Korrekturschlüssel: ${exercise.rubric_scoring}, 
        Lösung des Studenten: ${exercise.solution_student}`;

      return limit(() => retryOnError(async () => {
        const response = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: systemprompt },
            { role: 'user', content: prompt },
          ],
          model,
          temperature: 0,
        });

        return response;
      }));
    });

    Promise.all(tasks)
      .then(async resArr => {
        const results: string[] = [];
        resArr.forEach((response, index) => {
          results.push(response.choices[0]?.message.content ?? 'No response');

          const extractedPoints = extractPunktzahl(results[index]); // Punktzahl extrahieren
          const extractedFeedback = extractFeedback(results[index]); // Feedback extrahieren

          exercises[index].points_achieved = extractedPoints ?? "Nicht verfügbar"; // Punktzahl speichern
          exercises[index].feedback = extractedFeedback ?? "Nicht verfügbar"; // Feedback speichern
          exercises[index].correction = response.choices[0]?.message.content; // speichern von AI output in Correction

        });

        // Konvertieren Sie das aktualisierte exercises Array zurück in einen Excel-Buffer
        const ws = XLSX.utils.json_to_sheet(exercises);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelBufferConv = Buffer.from(excelBuffer);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment;filename=result.xlsx`);
        res.status(200).send(excelBufferConv); // Return Excel file instead of text

      })
      .catch(err => {
        throw err;
      });

  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}