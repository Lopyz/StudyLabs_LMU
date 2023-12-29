import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import ExcerciseTemplate from '@/models/ExcerciseTemplate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();
  } catch (error) {
    console.error('Database Connection Error: ', error);
    return res.status(500).json({ error: 'Ein Fehler ist beim Verbinden zur Datenbank aufgetreten.' });
  }

  try {
    const allDocuments = await ExcerciseTemplate.find().sort({ created_at: -1 });

    if (!allDocuments || allDocuments.length === 0) {
      return res.status(404).json({ error: 'Keine Schemata gefunden' });
    }

    const data = allDocuments.map(doc => ({
      _id: doc._id,
      name: doc.name,
      description: doc.description,
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error('Internal Error: ', error);
    res.status(500).json({ error: 'Ein interner Fehler ist aufgetreten' });
  }
}
