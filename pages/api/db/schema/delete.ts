import { NextApiRequest, NextApiResponse } from "next";
import ExcerciseTemplate from "@/models/ExcerciseTemplate";
import mongoose from 'mongoose'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'This route supports only DELETE method.' });
  }

  const { schemaId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(schemaId)) {
    return res.status(400).json({ message: 'Invalid ID.' }); 
  }

  try {
    const deletionResult = await ExcerciseTemplate.deleteOne({ _id: schemaId });

    if (deletionResult.deletedCount === 1) {
      res.status(200).json({ message: "Schema successfully deleted." });
    } else {
      res.status(404).json({ message: 'Schema not found.' }); 
    }
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error." }); 
  }
}