import mongoose, { Schema, Document } from "mongoose";

export interface IManga extends Document {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  rating: number;
  totalChapters: number;
  genre: string[];
  audience: string;
  status: string;
  year: number;
  alpha: string;
  createDate: Date;
  updateDate: Date;
  collectionsCount: number;
  tag: string;
  authorId: string; // 新增作者欄位
  authorNickname: string; // 新增作者暱稱
  authorUsername: string; // 新增作者用戶名
}

const MangaSchema: Schema = new Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
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
    required: true,
  },
  audience: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    required: true,
  },
  year: {
    type: Number,
    max: new Date().getFullYear(),
    required: true,
  },
  alpha: {
    type: String,
    trim: true,
    required: true,
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
  tag: {
    type: String,
    trim: true,
    required: false,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorNickname: {
    type: String,
    trim: true,
    required: false,
  },
  authorUsername: {
    type: String,
    trim: true,
    required: false,
  },
});

// 建立索引以提升查詢效能
MangaSchema.index({ title: "text", description: "text" });
MangaSchema.index({ genre: 1 });
MangaSchema.index({ rating: -1 });
MangaSchema.index({ createDate: -1 });
MangaSchema.index({ authorId: 1 }); // 新增作者索引
MangaSchema.index({ authorUsername: 1 }); // 新增作者用戶名索引

export default mongoose.models.Manga || mongoose.model<IManga>("Manga", MangaSchema);
