import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel, UpdatedExcelDocument } from '@/models/UpdatedExcelModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    const clerkId = req.query.clerkId as string;
    let userFiles: UpdatedExcelDocument[];

    if (clerkId) {
      userFiles = await UpdatedExcel.find({ clerkId });
    } else {
      userFiles = await UpdatedExcel.find({});
    }

    res.status(200).json({
      data: userFiles.map(file => ({
        id: file._id,
        filename: file.filename,
        timestamp: file.timestamp,
        username: file.username,
        grandTotalPoints: file.grandTotalPoints,
        grandTotalAchievablePoints: file.grandTotalAchievablePoints,
      }))
    });

  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
