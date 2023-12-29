import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDB();  // Verbinde zur Datenbank
  
  const { clerkId } = req.query;
  
  const user = await User.findOne({ clerkId: clerkId });
  
  if (!user) {
    return res.status(404).send("User not found");
  }
  
  return res.status(200).json(user);
} 