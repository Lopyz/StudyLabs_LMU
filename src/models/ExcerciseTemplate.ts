import mongoose, { Document, Schema } from 'mongoose';

interface ExcerciseTemplateDocument extends Document {
    content: string;
    created_at: Date;
}

const ExcerciseTemplateSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    systemprompt: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    excelFile: {
        originalName: String,
        mimeType: String,
        buffer: Buffer,
    }
});


// Überprüfen, ob das Modell bereits existiert, um den OverwriteModelError zu verhindern
const ExcerciseTemplate = mongoose.models.ExcerciseTemplate || mongoose.model<ExcerciseTemplateDocument>('ExcerciseTemplate', ExcerciseTemplateSchema, 'excercise_templates');

export default ExcerciseTemplate;
