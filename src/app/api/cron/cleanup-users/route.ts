import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Cron Job API - 定期清理過期用戶
export async function GET(request: NextRequest) {
  try {
    // 驗證 Cron Job 請求（可選的安全措施）
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: "未授權的請求" }, { status: 401 });
    }

    await dbConnect();

    // 查找所有過期且未驗證的用戶
    const expiredUsers = await User.find({
      emailVerified: false,
      emailVerificationExpires: { $lt: new Date() },
    });

    if (expiredUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "沒有找到過期的未驗證用戶",
        deletedCount: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // 刪除過期的未驗證用戶
    const result = await User.deleteMany({
      emailVerified: false,
      emailVerificationExpires: { $lt: new Date() },
    });

    // 記錄清理結果
    console.log(
      `[${new Date().toISOString()}] Cron Job: 已清理 ${result.deletedCount} 個過期未驗證用戶`
    );

    return NextResponse.json({
      success: true,
      message: `已清理 ${result.deletedCount} 個過期未驗證用戶`,
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron Job 清理失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
