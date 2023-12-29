import { NextApiRequest, NextApiResponse } from 'next';
import { Costs, CostsDocument } from '@/models/CostsModel';
import { connectToDB } from '@/utils/connectToDB';
import { subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    // Konvertiert die aktuelle Zeit in die Frankfurter Zeitzone und ermittelt das Datum für "vor 30 Tagen"
    const timezone = 'Europe/Berlin';
    const nowInFrankfurt = utcToZonedTime(new Date(), timezone);
    const thirtyDaysAgoInFrankfurt = subDays(nowInFrankfurt, 30);

    const files: CostsDocument[] = await Costs.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgoInFrankfurt }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp', timezone: 'Europe/Berlin' }
          },
          totalCosts: { $sum: { $toDouble: '$totalCosts' } }
        }
      },
      {
        $project: {
          _id: 1,
          totalCosts: {
            $round: ["$totalCosts", 3]
          }
        }
      },
      {
        $sort: { '_id': 1 }
      }
      
    ]);

    res.status(200).json(files);
  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
