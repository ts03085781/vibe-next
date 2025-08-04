import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "缺少必要參數" }, { status: 400 });
    }

    // 查找用戶
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "重設 Token 無效或已過期" },
        { status: 400 }
      );
    }

    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新用戶密碼並清除重設 Token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      updatedDate: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "密碼重設成功！",
    });
  } catch (error) {
    console.error("密碼重設失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}

// 驗證重設 Token 是否有效
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "缺少 Token" }, { status: 400 });
    }

    // 查找用戶
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Token 無效或已過期" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Token 有效",
    });
  } catch (error) {
    console.error("Token 驗證失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
