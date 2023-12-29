import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { ExamDocument, default as Exam } from '@/models/DataExcel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { schemaId } = req.query;

    try {
        await connectToDB();

        if (!schemaId) {
            return res.status(400).end('SchemaId is required.');
        }

        const taskCount: number = await Exam.countDocuments({ schemaId: schemaId as string });

        res.status(200).send({ taskCount });
    } catch (error) {
        console.error('Error during API handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}