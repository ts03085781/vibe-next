import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(request: NextRequest) {
  try {
    // 連線資料庫
    await dbConnect();

    // 取得使用者資訊
    const { username, email, password, nickname } = await request.json();

    // 檢查必填欄位
    if (!username || !email || !password || !nickname) {
      return NextResponse.json({ success: false, error: "缺少必要欄位" }, { status: 400 });
    }

    // 檢查唯一性
    const exist = await User.findOne({ $or: [{ username }, { email }, { nickname }] });
    if (exist) {
      return NextResponse.json(
        { success: false, error: "帳號或信箱或暱稱已被註冊" },
        { status: 409 }
      );
    }

    // 密碼加密
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, nickname });

    // 產生 JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 回傳使用者資訊
    return NextResponse.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
        avatar: user.avatar,
        createdDate: user.createdDate,
        updatedDate: user.updatedDate,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    console.error("註冊失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
