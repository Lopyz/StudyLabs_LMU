// pages/api/db/getExcelFile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel } from '@/models/UpdatedExcelModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectToDB();

      const fileId = req.query.fileId as string;

      // Find the specific file by fileId
      const file = await UpdatedExcel.findById(fileId);

      if (file) {
        res.status(200).json({ file });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error during API handler:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
