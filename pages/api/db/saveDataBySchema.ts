import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/connectToDB';
import { Costs } from '@/models/CostsModel';
import { UpdatedExcel } from '@/models/UpdatedExcelModel';
import DataExcel from '@/models/DataExcel';
import xlsx from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    const {clerkId, schemaName, totalCosts, username, grandTotalPoints, grandTotalAchievablePoints, excelBuffer, schemaId } = req.body;

    const timestamp = new Date();
    const filename = schemaName;
    
    // Speichern von Costs
    const costs = new Costs({
      filename,
      schemaId,
      clerkId,
      timestamp,
      totalCosts,
    });

    await costs.save();

    // Speichern von UpdatedExcel
    const updatedExcel = new UpdatedExcel({
      username: username || 'default', 
      clerkId,
      schemaId,
      excelFile: excelBuffer || Buffer.from(''),  
      timestamp,
      filename,
      grandTotalPoints: grandTotalPoints || '0', 
      grandTotalAchievablePoints: grandTotalAchievablePoints || '0',  
      totalCosts,
    });

    await updatedExcel.save();

    // Auslesen der Excel-Daten mit xlsx
    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const allData = xlsx.utils.sheet_to_json(sheet, { raw: false });
    
    const exercises = allData
  .filter((row: any) => row.exercise_id && row.points_achievable && row.points_achieved)
  .map((row: any) => ({
    exerciseId: row.exercise_id, 
    pointsAchievable: row.points_achievable,
    pointsAchieved: row.points_achieved
  }));
    
    const examData = new DataExcel({
      filename,
      clerkId,
      schemaId,
      exercises,
      grandTotalPoints: grandTotalPoints || 0,
      grandTotalAchievablePoints: grandTotalAchievablePoints || 0,
      timestamp
    });

    await examData.save();

    res.status(200).json({ message: 'Both Costs, Updated Excel file and Exam Data successfully saved to MongoDB.' });
  } catch (error) {
    console.error('Error during API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}