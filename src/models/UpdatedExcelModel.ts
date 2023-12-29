// UpdatedExcelModel.ts
import mongoose, { Model, Schema, Document } from 'mongoose';

export interface UpdatedExcelDocument extends Document {
  username: string;
  clerkId: string;
  schemaId: string;
  excelFile: Buffer;
  timestamp: Date;
  filename: string;
  grandTotalAchievablePoints: string;
  grandTotalPoints: string;
  totalCosts: string;
}

const UpdatedExcelSchema = new Schema<UpdatedExcelDocument>({
  username: String,
  clerkId: String,
  schemaId: String,
  excelFile: Buffer,
  timestamp: Date,
  filename: String,
  grandTotalAchievablePoints: String,
  grandTotalPoints: String,
  totalCosts: String,
});

export const UpdatedExcel: Model<UpdatedExcelDocument> = mongoose.models.UpdatedExcel || 
  mongoose.model('UpdatedExcel', UpdatedExcelSchema);
