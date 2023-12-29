// CostsModel.ts
import mongoose, { Model, Schema, Document } from 'mongoose';

export interface CostsDocument extends Document {
  filename: string;
  clerkId: string;
  schemaId: string;
  timestamp: Date;
  totalCosts: string;
}

const CostsSchema = new Schema<CostsDocument>({
  filename: String,
  clerkId: String,
  schemaId: String,
  timestamp: Date,
  totalCosts: String,
});

export const Costs: Model<CostsDocument> = mongoose.models.Costs || 
  mongoose.model('Costs', CostsSchema);
