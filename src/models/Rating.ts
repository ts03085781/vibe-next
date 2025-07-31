import mongoose, { Schema, Document } from "mongoose";

export interface IRating extends Document {
  userId: string;
  mangaId: string;
  rating: number; // 0-10 的評分
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    mangaId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// 建立複合索引，確保每個用戶對每部漫畫只能有一個評分
RatingSchema.index({ userId: 1, mangaId: 1 }, { unique: true });

export default mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);
