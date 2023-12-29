import { NextApiRequest, NextApiResponse } from "next";
import Exam, { ExamDocument } from "@/models/DataExcel";
import { connectToDB } from "@/utils/connectToDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { schemaId } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).end("Diese Route unterstützt nur die DELETE-Methode.");
  }

  try {
    await connectToDB();

    await Exam.deleteMany({ schemaId });

    res.status(200).end("Tasks erfolgreich gelöscht.");
  } catch (error) {
    console.error(error);
    res.status(500).end("Interner Serverfehler.");
  }
}