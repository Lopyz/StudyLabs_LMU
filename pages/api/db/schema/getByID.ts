import { connectToDB } from '@/utils/connectToDB';
import { NextApiRequest, NextApiResponse } from 'next';
import XLSX from 'xlsx';
import mongoose from 'mongoose';
import ExcerciseTemplate from '@/models/ExcerciseTemplate';

async function handleRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { id } = req.query; 

  try {
    await connectToDB();
  } catch (error) {
    console.error('Database Connection Error: ', error);
    return res.status(500).json({ error: 'Ein Fehler ist beim Verbinden zur Datenbank aufgetreten.' });
  }

  try {
    const { data, systemprompt, name, description } = await fetchFileAndPromptById(id as string);
    res.status(200).json({ data, systemprompt, name, description });
  } catch (error) {
    console.error('Internal Error: ', error);
    res.status(500).json({ error: 'Ein interner Fehler ist aufgetreten' });
  }
}

async function fetchFileAndPromptById(id: string) {
  const document = await ExcerciseTemplate.findById(id);

  if (!document) {
    throw new Error('Kein Dokument gefunden');
  }

  const data = await readExcelFile(document.excelFile.buffer);
  const systemprompt = document.systemprompt;
  const name = document.name;
  const description = document.description;

  return { data, systemprompt, name, description };
}

export default handleRequest;

async function fetchLatestFileAndPrompt() {
  const latestDocument = await ExcerciseTemplate.findOne().sort({ created_at: -1 }).limit(1);

  if (!latestDocument) {
    throw new Error('Kein Dokument gefunden');
  }

  const systemprompt = latestDocument.systemprompt;
  const data = await readExcelFile(latestDocument.excelFile.buffer);

  return { data, systemprompt };
}

async function readExcelFile(buffer: Buffer) {
  return new Promise<any>((resolve, reject) => {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      resolve(data);
    } catch (error) {
      console.error(error);
      reject(new Error('Ein Fehler ist beim Lesen der Excel-Datei aufgetreten.'));
    }
  });
}