import mongoose, { Schema, Document } from "mongoose";

export interface IChapter extends Document {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  content: string;
  publishDate: Date;
}

const ChapterSchema: Schema = new Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  mangaId: {
    type: Schema.Types.ObjectId,
    ref: "Manga",
    required: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
});

// 確保每個漫畫的章節編號唯一
ChapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true });

// 建立索引以提升查詢效能
ChapterSchema.index({ mangaId: 1 });
ChapterSchema.index({ publishDate: -1 });

export default mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);
