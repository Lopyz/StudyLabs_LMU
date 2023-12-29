// Import-Anweisungen
import nextConnect from 'next-connect';
import multer, { MulterError } from 'multer';
import mongoose, { Types } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import ExcerciseTemplate from '@/models/ExcerciseTemplate';
import { connectToDB } from '@/utils/connectToDB';

// Typendeklaration
interface MulterRequest extends NextApiRequest {
    file?: Express.Multer.File;
}

// Multer-Konfiguration
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => {
        const ext = file.originalname.split('.').pop();
        if (ext !== 'xls' && ext !== 'xlsx') {
            return callback(new MulterError('LIMIT_UNEXPECTED_FILE'));
        }
        callback(null, true);
    }
}).single('excelUpload');

// API-Route-Konfiguration
export const config = {
    api: {
        bodyParser: false,
    },
};

// Fehlerbehandlungs- und No-Match-Handler
const errorHandler = (error: Error | MulterError, req: MulterRequest, res: NextApiResponse) => {
    res.status(501).json({ error: `Sorry, etwas ist schief gelaufen! ${error.message}` });
};

const noMatchHandler = (req: MulterRequest, res: NextApiResponse) => {
    res.status(405).json({ error: `Die Methode ${req.method} ist nicht erlaubt` });
};

// API-Route-Definition
const apiRoute = nextConnect({ onError: errorHandler, onNoMatch: noMatchHandler });

// Multer-Middleware
apiRoute.use(upload);

// POST-Handler
const postHandler = async (req: MulterRequest, res: NextApiResponse) => {
    const { file, body: { systemprompt, name, description } } = req;
    if (!file || !systemprompt || !name || !description) {
        return res.status(400).json({ error: 'Bitte gib alle erforderlichen Details ein' });
    }

    try {
        await connectToDB();
        const commonId = new Types.ObjectId();

        // Systemprompt, Titel und Dateiinformationen speichern
        const prompt = new ExcerciseTemplate({
            _id: commonId,
            systemprompt: systemprompt,
            name: name,
            description: description,
            excelFile: {
                originalName: file.originalname,
                mimeType: file.mimetype,
                buffer: file.buffer,
            }
        });
        await prompt.save();

        res.status(200).json({ message: 'Erfolgreich hochgeladen und in der Datenbank gespeichert.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Ein Fehler ist aufgetreten` });
    }
};


// POST-Route hinzufügen
apiRoute.post(postHandler);

// Export
export default apiRoute;
