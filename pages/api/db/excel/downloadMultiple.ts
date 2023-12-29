// pages/api/db/excel/downloadMultiple.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel, UpdatedExcelDocument } from '@/models/UpdatedExcelModel';
import archiver from 'archiver';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectToDB();

      const fileIdsParam = req.query.fileIds as string;
      const fileIds = fileIdsParam.split(','); // Hier wird die Konvertierung von String zu Array vorgenommen

      const files: UpdatedExcelDocument[] = await UpdatedExcel.find({ 
        '_id': { $in: fileIds } 
      });

      if (files.length > 0) {
        const archive = archiver('zip', {
          zlib: { level: 9 } // Stellt das Kompressionslevel ein.
        });

        res.setHeader('Content-Disposition', 'attachment; filename=files.zip');
        res.setHeader('Content-Type', 'application/zip');

        archive.pipe(res);

        files.forEach(file => {
          if (file.excelFile) { 
            archive.append(file.excelFile, { name: `${file.filename}.xlsx` });
          } else {
            console.error('No data in file', file.id);
          }
        });
       //@ts-ignore
        archive.on('error', function(err) {
          throw err;
        });

        archive.finalize();
      } else {
        res.status(404).json({ error: 'Files not found' });
      }
    } catch (error) {
      console.error('Error during API handler:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
