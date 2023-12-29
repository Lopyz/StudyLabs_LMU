import mongoose, { Schema, Document } from 'mongoose';

export interface ExamDocument extends Document {
  clerkId: string;
  schemaId: string;
  filename: string;
  timestamp: Date,
  exercises: Array<{
    exerciseId: string;
    pointsAchievable: number;
    pointsAchieved: number;
  }>;
  grandTotalPoints: number;
  grandTotalAchievablePoints: number;
}

const examSchema = new Schema<ExamDocument>({
  filename: {
    type: String,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
  },
  schemaId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  exercises: [
    {
      exerciseId: {
        type: String,
        required: true,
      },
      pointsAchievable: {
        type: Number,
        required: true,
      },
      pointsAchieved: {
        type: Number,
        required: true,
      },
    },
  ],
  grandTotalPoints: {
      type: Number,
      default: 0, 
  },
  grandTotalAchievablePoints: {
      type: Number,
      default: 0,  
  },
});

export default mongoose.models.Exam || mongoose.model('Exam', examSchema);