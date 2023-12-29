//import type { NextApiRequest, NextApiResponse } from 'next';
//import axios from 'axios';

//export const config = {
// maxDuration: 300,
//};

//const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//  if (req.method !== 'POST') {
//      return res.status(405).json({ message: 'Method Not Allowed' });
//  }

//   if (!isAuthorized(req)) {
//      return res.status(403).json({ message: 'Forbidden' });
//   }

// const users = req.body as { username: string; password: string }[];
//    const results = [];
//  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// for (const user of users) {
//   try {

//    const response = await axios.post('https:api.clerk.com/v1/users', {
//  "username": user.username,
//    "password": user.password
// }, {
//       headers: {
//   Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//     'Content-Type': 'application/json'
//   }

// });
//  results.push(response.data);
//} catch (error) {
//  console.error('Failed to create user:', user.username, error);
//}
//  await delay(500);
//}

//  return res.status(200).json({ message: 'Users created', results });
//};

//const isAuthorized = (req: NextApiRequest): boolean => {
//  return true;
//};

//export default handler;