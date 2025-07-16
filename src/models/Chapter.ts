import mongoose, { Schema, Document } from "mongoose";

export interface IChapter extends Document {
  mangaId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  publishDate?: Date;
  createDate: Date;
  updateDate: Date;
}

const ChapterSchema: Schema = new Schema({
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
  wordCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  createDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
  },
});

// 確保每個漫畫的章節編號唯一
ChapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true });

// 建立索引以提升查詢效能
ChapterSchema.index({ mangaId: 1 });
ChapterSchema.index({ publishDate: -1 });

export default mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);
