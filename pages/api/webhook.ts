import type { IncomingHttpHeaders } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookRequiredHeaders } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { connectToDB } from '@/utils/connectToDB';
import { saveUser } from '@/utils/userSave';
import { updateUser } from '@/utils/userUpdate';
import { deleteUser } from '@/utils/userDelete';

const webhookSecret: string = process.env.WEBHOOK_SECRET!;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  await connectToDB();

  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    return res.status(400).json({});
  }

  const eventType = evt.type;
  switch (eventType) {
    case 'user.created':
      await saveUser(evt);
      res.status(201).json({});
      break;
    case 'user.updated':
      await updateUser(evt);
      res.status(200).json({});
      break;
    case 'user.deleted':
      await deleteUser(evt);
      res.status(200).json({});
      break;
    default:
      res.status(400).json({ error: 'Unrecognized event type' });
      break;
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
