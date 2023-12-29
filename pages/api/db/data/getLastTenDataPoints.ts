import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel, UpdatedExcelDocument } from '@/models/UpdatedExcelModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    const clerkId = req.query.clerkId as string;

    const dataPoints: UpdatedExcelDocument[] = await UpdatedExcel.find({ clerkId: clerkId })
      .sort({ timestamp: -1 })
      .limit(10);

    const grandTotalAchievablePoints = dataPoints.map(dp => Number(dp.grandTotalAchievablePoints));
    const grandTotalPoints = dataPoints.map(dp => Number(dp.grandTotalPoints));

    res.status(200).json({ grandTotalAchievablePoints, grandTotalPoints });
  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
