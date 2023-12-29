import { NextApiRequest, NextApiResponse } from 'next';
import ChatMessage, { ChatMessageDocument } from '@/models/ChatMessage';
import { connectToDB } from '@/utils/connectToDB';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDB();

  if (req.method === 'POST') {
    const { clerkId, uuid, message, sender, filename, schemaId, originId, exercise_id } = req.body;

    try {
      if (!uuid) {
        return res.status(400).json({ error: 'UUID is required' });
      }
      if (!clerkId) {
        return res.status(400).json({ error: 'Clerk ID is required' });
      }

      // Verwende die ClerkID und die UUID, um eine eindeutige chatId zu erstellen
      const chatId = `${clerkId}-${uuid}`;

      const chat = await ChatMessage.findOneAndUpdate(
        { chatId },
        {
          $push: { messages: { sender, message, timestamp: Date.now() } },
          $setOnInsert: { clerkId, uuid, filename, schemaId, originId, exercise_id }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.status(200).json(chat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { clerkId, uuid } = req.query;

    try {
      if (!uuid) {
        return res.status(400).json({ error: 'UUID is required' });
      }
      if (!clerkId) {
        return res.status(400).json({ error: 'Clerk ID is required' });
      }

      // Verwende die ClerkID und die UUID, um eine eindeutige chatId zu erstellen
      const chatId = `${clerkId}-${uuid}`;

      const chat = await ChatMessage.findOne({ chatId });
      res.status(200).json(chat || { messages: [] }); // Wenn keine Nachrichten vorhanden sind, leere Liste zurückgeben
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;