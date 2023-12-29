import { NextApiRequest, NextApiResponse } from 'next';
import { Costs, CostsDocument } from '@/models/CostsModel';
import { connectToDB } from '@/utils/connectToDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    const files: CostsDocument[] = await Costs.find({
      timestamp:  {$gte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))}
    });

    let totalCosts = 0;
    files.forEach(file => {
      totalCosts += Number(file.totalCosts);
    });

    const totalDocuments = files.length;
    const averageCostPerDocument = totalDocuments > 0 ? totalCosts / totalDocuments : 0;

    res.status(200).json({ totalCosts, totalDocuments, averageCostPerDocument });
  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
