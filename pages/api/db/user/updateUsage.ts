// pages/api/db/user/updateUsage.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();

  if (req.method !== 'PUT') {
    return res.status(405).end(); // Methode nicht erlaubt
  }

  const { clerkId, newUsage } = req.body;

  const user = await User.findOne({ clerkId: clerkId });
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Addiere die bisherige Nutzung (usage) zu newUsage
  user.maxUsage = user.usage + newUsage;
  
  await user.save();

  return res.status(200).json({ message: 'Usage updated successfully' });
}
