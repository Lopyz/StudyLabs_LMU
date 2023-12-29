import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { ExamDocument, default as DataExcel } from '@/models/DataExcel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { schemaId } = req.query;

    await connectToDB();

    if (!schemaId) {
        return res.status(400).json({ error: 'SchemaId is required.' });
    }

    const result = await DataExcel.aggregate([
      { $match: { schemaId: schemaId as string } },
      { $unwind: "$exercises" },
      { $group: {
        _id: "$exercises.exerciseId",
        averageAchieved: { $avg: "$exercises.pointsAchieved" }, 
        averagePossible: { $avg: "$exercises.pointsAchievable" }
      } },
      { $sort: { _id: 1 } } 
  ]);

    if(!result) {
        return res.status(200).json({ averagePoints: "0", averagePossiblePoints: "0" });
    }

    res.status(200).json(result);
}