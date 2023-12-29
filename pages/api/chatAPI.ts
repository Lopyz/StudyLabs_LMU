import { ChatBody } from '@/types/types';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import endent from 'endent';

export const config = {
  maxDuration: 120,
};

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// The createPrompt function from your old code
const createPrompt = (inputCode: string) => {
  const data = (inputCode: string) => {
    return endent`
    Du bist eine KI, die einem Studenten dabei hilft, Fragen zu seiner Klausuraufgabe zu beantworten, die du zuvor korrigiert hast. 
    Deine Antworten sollten klar, freundlich und unterstützend sein und direkt auf den Kontext der Aufgabenstellung, Musterlösung, Schülerantwort, erreichbaren und erreichten Punkte sowie das zuvor gegebene Feedback eingehen. 
    Berücksichtige den gesamten Chatverlauf, um ein tieferes Verständnis der Anfragen und vorherigen Diskussionen zu erlangen. Passe deine Antworten dynamisch an, basierend auf neuen Informationen, die im Verlauf des Gesprächs hinzukommen.
    Nutze Informationen aus früheren Nachrichten, um kohärente und kontextbezogene Antworten zu geben. Verknüpfe aktuelle Anfragen mit relevanten Punkten aus dem vorherigen Dialog, um umfassendere und hilfreichere Antworten zu bieten. 
    Achte dabei stets auf eine positive und motivierende Sprache und passe deine Erklärungen an den Kenntnisstand des Studenten an. Verwende bei Bedarf Beispiele oder Analogien, um komplexe Konzepte zu veranschaulichen.
      ${inputCode}
    `;
  };

  if (inputCode) {
    return data(inputCode);
  }
};

export default async function handler(req: Request) {

  const { inputCode } = (await req.json()) as ChatBody;

  // Generate the prompt using createPrompt function
  const prompt = createPrompt(inputCode);

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    messages: [{ role: 'user', content: prompt }]
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
