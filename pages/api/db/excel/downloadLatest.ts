import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel, UpdatedExcelDocument } from '@/models/UpdatedExcelModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectToDB();

      const clerkId = req.query.clerkId as string;

      // Find the latest file uploaded by the user
      const file = await UpdatedExcel.findOne({ clerkId }).sort('-timestamp');

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
