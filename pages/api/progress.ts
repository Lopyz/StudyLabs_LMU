{/* import { NextApiRequest, NextApiResponse } from 'next';
import EventEmitter from 'events';

export const config = {
  maxDuration: 120,
};
export const dynamic = 'force-dynamic';

const ProgressEmitter = new EventEmitter();

export function sendProgress(newProgress: number) {
  ProgressEmitter.emit('progress', newProgress);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    sendProgress(0);
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
    });
    res.flushHeaders();

    // Keep the connection alive
    const keepAlive = setInterval(() => {
      res.write(':\n\n');
    }, 5000); // every 5 seconds

    const progressListener = (progress: number) => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
      (res as any).flush();

      if (progress >= 100) {
        clearInterval(keepAlive);  // clear the keep-alive interval
        res.end();
      }
    };

    ProgressEmitter.on('progress', progressListener);

    req.on('close', () => {
      clearInterval(keepAlive);  // clear the keep-alive interval
      ProgressEmitter.off('progress', progressListener);
    });

    return;
  }

  res.status(405).end();
} */}