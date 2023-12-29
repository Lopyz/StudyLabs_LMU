import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel } from '@/models/UpdatedExcelModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDB();
      const fileId = req.query.fileId as string;
      const { newFileName } = req.body;

      if (!fileId || !newFileName) {
        res.status(400).json({ error: 'Datei-ID und neuer Dateiname sind erforderlich' });
        return;
      }

      const result = await UpdatedExcel.findByIdAndUpdate(
        fileId,
        { filename: newFileName },
        { new: true }
      );

      if (result) {
        res.status(200).json({ message: 'Dateiname erfolgreich aktualisiert' });
      } else {
        res.status(404).json({ error: 'Datei nicht gefunden' });
      }
    } catch (error) {
      console.error('Error in API handler:', error);
      res.status(500).json({ error: 'Serverfehler' });
    }
  } else {
    res.status(405).json({ error: 'Methode ist nicht erlaubt' });
  }
}