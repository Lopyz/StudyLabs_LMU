import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel } from '@/models/UpdatedExcelModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      await connectToDB();
      const fileId = req.query.id as string;
      if (!fileId) {
        res.status(400).json({ error: 'Datei-ID ist erforderlich' });
        return;
      }
      const result = await UpdatedExcel.findByIdAndDelete(fileId);
      if (result) {
        res.status(200).json({ message: 'Datei erfolgreich gelöscht' }); 
      } else {
        res.status(404).json({ error: 'Datei nicht gefunden' });
      }
    } catch (error) {
      console.error('Fehler während des API-Handlers:', error);
      res.status(500).json({ error: 'Interner Serverfehler' });
    }
  } else {
    res.status(405).json({ error: 'Methode nicht erlaubt' });
  }
}
