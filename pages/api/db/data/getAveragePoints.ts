import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { ExamDocument, default as Exam } from '@/models/DataExcel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { schemaId } = req.query;

    await connectToDB();

    if (!schemaId) {
        return res.status(400).json({ error: 'SchemaId is required.' });
    }

    const scores = await Exam.aggregate([
        { $match: { schemaId: schemaId as string } },
        { $group: { _id: null, total: { $sum: '$grandTotalPoints' }, count: { $sum: 1 } } },
    ]);

    if(!scores[0]) {
        return res.status(200).json({ averagePoints: "0" });
    }

    const averagePoints = (scores[0].total / scores[0].count).toFixed(2);

    res.status(200).json({ averagePoints });
}