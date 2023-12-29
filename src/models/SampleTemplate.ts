import mongoose, { Document, Schema } from 'mongoose';

interface SampleTemplateDocument extends Document {
    content: string;
    created_at: Date;
}

const SampleTemplateSchema = new Schema({
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
const SampleTemplate = mongoose.models.SampleTemplate || mongoose.model<SampleTemplateDocument>('SampleTemplate', SampleTemplateSchema, 'sample_template');

export default SampleTemplate;
