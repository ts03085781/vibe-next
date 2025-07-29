import { Schema, Document, model, models } from "mongoose";

// 用戶的 TypeScript 介面
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  nickname: string;
  avatar: string;
  createdDate: Date;
  updatedDate: Date;
  refreshToken?: string; // 新增：Refresh Token
  lastActivityAt?: Date; // 新增：最後活動時間
  sessionStartedAt?: Date; // 新增：會話開始時間
}

// User 的 Mongoose Schema
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  nickname: { type: String, default: "" },
  avatar: { type: String, default: "" },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  refreshToken: { type: String, default: null }, // 新增：Refresh Token
  lastActivityAt: { type: Date, default: Date.now }, // 新增：最後活動時間
  sessionStartedAt: { type: Date, default: Date.now }, // 新增：會話開始時間
});

// 避免重複註冊 model
export default models.User || model<IUser>("User", UserSchema);
