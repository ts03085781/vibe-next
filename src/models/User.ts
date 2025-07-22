import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  nickname: string;
  email: string;
  password: string; // 加密後密碼
  avatar?: string;
  role: "user" | "admin";
  favorites: mongoose.Types.ObjectId[];
  createdDate: Date;
  updatedDate: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /.+@.+\..+/, // 基本 email 格式驗證
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export default models.User || model<IUser>("User", UserSchema);
