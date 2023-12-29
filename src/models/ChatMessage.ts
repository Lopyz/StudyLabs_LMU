import mongoose, { Schema, Document } from 'mongoose';

export interface ChatMessageDocument extends Document {
  chatId: string;
  clerkId: string;
  schemaId: string;
  originId: string;
  uuid: string;
  filename: string;
  exercise_id: string;
  messages: Array<{
    sender: string;
    message: string;
    timestamp: Date;
  }>;
}

const chatMessageSchema = new Schema<ChatMessageDocument>({
  // Dateiname des spezifischen Dokuments
  filename: {
    type: String,
    required: true
  },
  // Übung ID des spezifischen Dokuments
  exercise_id: {
    type: String,
    required: true
  },
  // Eindeutige ID für den Chat-Verlauf, bestehend aus clerkId und uuid
  chatId: {
    type: String,
    required: true
  },
  // ClerkID des Nutzers
  clerkId: {
    type: String,
    required: true
  },
  //Id des Schemas
  schemaId: {
    type: String,
    required: true
  },
  // OriginId des spezifischen Dokuments
  originId: {
    type: String,
    required: true
  },
  // UUID des spezifischen Chat-Verlaufs
  uuid: {
    type: String,
    required: true
  },
  // Nachrichtenverlauf
  messages: [
    {
      sender: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
});

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);