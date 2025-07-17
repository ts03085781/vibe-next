import mongoose, { Schema, Document } from "mongoose";

export interface IManga extends Document {
  title: string;
  description?: string;
  coverImage?: string;
  rating: number;
  totalChapters: number;
  genre: string[];
  audience?: string;
  status?: string;
  year?: number;
  alpha?: string;
  createDate: Date;
  updateDate: Date;
  collectionsCount: number;
}

const MangaSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 10,
    },
    totalChapters: {
      type: Number,
      default: 0,
      min: 0,
    },
    genre: {
      type: [String],
    },
    audience: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    alpha: {
      type: String,
      trim: true,
    },
    createDate: {
      type: Date,
    },
    updateDate: {
      type: Date,
    },
    collectionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 建立索引以提升查詢效能
MangaSchema.index({ title: "text", description: "text" });
MangaSchema.index({ genre: 1 });
MangaSchema.index({ rating: -1 });
MangaSchema.index({ createDate: -1 });

export default mongoose.models.Manga || mongoose.model<IManga>("Manga", MangaSchema);
