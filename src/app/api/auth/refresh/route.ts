import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function POST(request: NextRequest) {
  try {
    // 檢查 JWT_SECRET 與 REFRESH_SECRET 是否設定
    if (!JWT_SECRET || !REFRESH_SECRET) {
      return NextResponse.json(
        { success: false, error: "JWT_SECRET 或 REFRESH_SECRET 未設定" },
        { status: 500 }
      );
    }

    // 連接資料庫
    await dbConnect();

    // 取得 refreshToken
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // 如果沒有 refreshToken，則返回 401
    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "No refresh token" }, { status: 401 });
    }

    try {
      // 驗證 Refresh Token
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };

      // 檢查資料庫中的 Refresh Token
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return NextResponse.json(
          { success: false, error: "Invalid refresh token" },
          { status: 401 }
        );
      }

      // 檢查會話是否超過最大時間（30天）
      const sessionDuration = Date.now() - user.sessionStartedAt.getTime();
      const MAX_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30天

      // 如果會話超過最大時間，則返回 401
      if (sessionDuration > MAX_SESSION_DURATION) {
        return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
      }

      // 產生新的 Access Token 對
      const newAccessToken = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      // 產生新的 Refresh Token
      const newRefreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

      // 更新資料庫（滑動過期）
      await User.findByIdAndUpdate(user._id, {
        refreshToken: newRefreshToken,
        lastActivityAt: new Date(),
      });

      // 回傳新的 Access Token
      const response = NextResponse.json({
        success: true,
        data: { accessToken: newAccessToken },
      });

      // 設定新的 Cookie (refreshToken)
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      });

      return response;
    } catch (e) {
      console.error("驗證 Refresh Token 失敗:", e);
      return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
    }
  } catch (e) {
    console.error("刷新失敗:", e);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
