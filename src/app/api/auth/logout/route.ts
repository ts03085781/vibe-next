import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getUserIdFromToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得用戶 ID
    const userId = getUserIdFromToken(request);

    // 如果用戶 ID 存在，則清除用戶的資料庫資料中的 Refresh Token，並設定 lastActivityAt 為現在時間
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        refreshToken: null,
        lastActivityAt: new Date(),
      });
    }

    // 清除 Cookie (refreshToken)
    const response = NextResponse.json({ success: true });
    response.cookies.delete("refreshToken");

    return response;
  } catch (e) {
    console.error("登出失敗:", e);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
