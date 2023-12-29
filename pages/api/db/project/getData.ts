// api/db/project/getData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import xlsx from 'xlsx';
import { UpdatedExcel } from '@/models/UpdatedExcelModel'; // Stellen Sie sicher, dass dies ein Mongoose-Modell ist

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB(); // Diese Funktion sollte eine Mongoose-Verbindung aufbauen

    const fileId = req.query.fileId as string;

    const file = await UpdatedExcel.findById(fileId); // Verwendung von Mongoose findById

    if (file) {
      const workbook = xlsx.read(file.excelFile.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet, { raw: false });
      // Map to the desired structure
      const structuredData = data
        .filter((row: any) => row.solution_student && row.solution_student.trim() !== '') // Nur Zeilen mit nicht-leerem solution_student
        .map((row: any) => ({
          exercise_id: row.exercise_id,
          exercise_text: row.exercise_text,
          solution_student: row.solution_student,
          points_achievable: row.points_achievable,
          points_achieved: row.points_achieved,
          feedback: row.feedback,
        }));

      res.status(200).json({
        data: structuredData,
        filename: file.filename,
        grandTotalPoints: file.grandTotalPoints,
        grandTotalAchievablePoints: file.grandTotalAchievablePoints
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}