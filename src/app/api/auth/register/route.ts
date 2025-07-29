import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function POST(request: NextRequest) {
  try {
    // 檢查 JWT_SECRET 是否設定
    if (!JWT_SECRET || !REFRESH_SECRET) {
      return NextResponse.json(
        { success: false, error: "JWT_SECRET 或 REFRESH_SECRET 未設定" },
        { status: 500 }
      );
    }

    // 連線資料庫
    await dbConnect();

    // 取得使用者資訊
    const { username, email, password, nickname } = await request.json();

    // 檢查必填欄位
    if (!username || !email || !password || !nickname) {
      return NextResponse.json({ success: false, error: "缺少必要欄位" }, { status: 400 });
    }

    // 檢查用戶是否已存在資料庫
    const exist = await User.findOne({ $or: [{ username }, { email }] });
    if (exist) {
      return NextResponse.json({ success: false, error: "帳號或信箱已存在" }, { status: 400 });
    }

    // 密碼加密
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      nickname,
      createdDate: new Date(),
      updatedDate: new Date(),
    });

    // 產生 Access Token 15分鐘過期
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 產生 Refresh Token 7天過期
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    // 更新用戶資料（滑動過期），設定 refreshToken、sessionStartedAt、lastActivityAt
    await User.findByIdAndUpdate(user._id, {
      refreshToken,
      sessionStartedAt: new Date(),
      lastActivityAt: new Date(),
    });

    // 回傳使用者資訊
    const response = NextResponse.json({
      success: true,
      data: {
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          nickname: user.nickname,
          avatar: user.avatar,
          createdDate: user.createdDate,
          updatedDate: user.updatedDate,
        },
      },
    });

    // 設定 Refresh Token Cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    });

    return response;
  } catch (error) {
    console.error("註冊失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
