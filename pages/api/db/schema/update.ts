import type { NextApiRequest, NextApiResponse } from 'next';
import ExcerciseTemplate from '@/models/ExcerciseTemplate';
import { connectToDB } from '@/utils/connectToDB';
import XLSX from 'xlsx';

// Funktion zum Aktualisieren des Templats
const updateTemplate = async (id: string, newContent: string, newName: string, newDescription: string, newExercises: any[]) => {
  const template = await ExcerciseTemplate.findById(id);
  if (!template) {
    throw new Error('Template Not Found');
  }
  // Überprüfen, ob die Felder ausgefüllt sind, bevor wir sie zuweisen
  if (newContent) {
    template.systemprompt = newContent;
  }
  if (newName) {
    template.name = newName;
  }
  if (newDescription) {
    template.description = newDescription;
  }
  // Setzen der Übungen
  if(newExercises){
    // Erstellen Sie ein neues Arbeitsblatt aus den aktualisierten Übungen
    const newSheet = XLSX.utils.json_to_sheet(newExercises);
    // Erstellen Sie eine neue Arbeitsmappe und führen Sie das neue Arbeitsblatt hinzu
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet);
    // Konvertieren Sie die Arbeitsmappe in einen Buffer
    const newBuffer = XLSX.write(newWorkbook, {type: 'buffer'});
    // Setzen Sie den Buffer als neue Excel-Datei in das Schema
    template.excelFile.buffer = newBuffer;
  }
  
  await template.save();
  return template;
};

// Funktion zum Behandeln von PUT-Anfragen
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, content, updatedname, updateddescription, exercises } = req.body;

  try {
    // Aktualisieren Sie den Prompt-Inhalt, den Namen und die Beschreibung
    const updatedTemplate = await updateTemplate(id, content, updatedname, updateddescription, exercises);
    return res.status(200).json({ success: true, data: updatedTemplate });
  } catch (error) {
    console.error('Error Updating Template:', error);
    return res.status(500).json({ success: false, error: 'Ein Fehler ist beim Aktualisieren des Templates aufgetreten.' });
  }
};

// Hauptfunktion
const editTemplate = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDB();  // Verbindung zur Datenbank herstellen 
  } catch (error) {
    console.error('Database Connection Error:', error);
    return res.status(500).json({ error: 'Ein Fehler ist beim Verbinden zur Datenbank aufgetreten.' });
  }

  switch (req.method) {
    case 'PUT':
      await handlePutRequest(req, res);
      break;
    default:
      res.status(400).json({ success: false });
  }
};

export default editTemplate;