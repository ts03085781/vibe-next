import mongoose, { Schema, Document, model, models } from "mongoose";

// 留言的 TypeScript 介面
export interface IComment extends Document {
  mangaId: string; // 對應作品 ID
  userId: string; // 留言者 ID
  username: string; // 留言者名稱
  content: string; // 留言內容
  createdDate: Date; // 建立時間
  updatedDate: Date; // 更新時間
  likes: string[]; // 按讚的 userId 陣列
}

// Comment 的 Mongoose Schema
const CommentSchema = new Schema<IComment>({
  mangaId: { type: String, required: true, index: true }, // 作品 ID
  userId: { type: String, required: true }, // 用戶 ID
  username: { type: String, required: true }, // 用戶名稱
  content: { type: String, required: true }, // 內容
  createdDate: { type: Date, default: Date.now }, // 建立時間
  updatedDate: { type: Date, default: Date.now }, // 更新時間
  likes: [{ type: String }], // 按讚的 userId 陣列
});

// 避免重複註冊 model
export default models.Comment || model<IComment>("Comment", CommentSchema);
