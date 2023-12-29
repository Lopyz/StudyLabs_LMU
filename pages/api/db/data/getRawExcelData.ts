import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { UpdatedExcel, UpdatedExcelDocument } from '@/models/UpdatedExcelModel';
import xlsx from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectToDB();

      const clerkId = req.query.clerkId as string;
      const selectedTasks = (req.query.tasks as string).split(',').map(Number); // Extrahieren Sie die ausgewählten tasks aus der Anforderung

      // Finde die neueste Datei, die vom Benutzer hochgeladen wurde
      const file: UpdatedExcelDocument | null = await UpdatedExcel.findOne({ clerkId }).sort('-timestamp');

      if (file) {
        // Parse das Buffer zurück zu einer Excel-Datei
        const workbook = xlsx.read(file.excelFile, { type: 'buffer' });

        // Bekomme das erste Arbeitsblatt
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertiere das gesamte Arbeitsblatt zu JSON
        const allData = xlsx.utils.sheet_to_json(sheet, { raw: false });

        // Extrahiere die gewünschten Spalten und filter für ausgewählte Aufgaben
        //@ts-ignore
        const jsonData = allData
        //@ts-ignore
          .filter((_, index) => selectedTasks.includes(index))
          //@ts-ignore
          .map(row => ({
            exercise_id: row.exercise_id,
            exercise_text: row.exercise_text,
            solution_student: row.solution_student,
            points_achievable: row.points_achievable,
            points_achieved: row.points_achieved,
            solution_correct: row.solution_correct,
            feedback: row.feedback,
          }));

        res.status(200).json({ data: jsonData, filename: file.filename, id: file._id  });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error during API handler:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}