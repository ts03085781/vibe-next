import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// 清理過期未驗證用戶的 API
export async function POST(request: NextRequest) {
  try {
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
      });
    }

    // 刪除過期的未驗證用戶
    const result = await User.deleteMany({
      emailVerified: false,
      emailVerificationExpires: { $lt: new Date() },
    });

    console.log(`已清理 ${result.deletedCount} 個過期未驗證用戶`);

    return NextResponse.json({
      success: true,
      message: `已清理 ${result.deletedCount} 個過期未驗證用戶`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("清理過期用戶失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}

// 獲取過期用戶統計資訊
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 統計過期未驗證用戶數量
    const expiredCount = await User.countDocuments({
      emailVerified: false,
      emailVerificationExpires: { $lt: new Date() },
    });

    // 統計總未驗證用戶數量
    const totalUnverifiedCount = await User.countDocuments({
      emailVerified: false,
    });

    return NextResponse.json({
      success: true,
      data: {
        expiredUnverifiedCount: expiredCount,
        totalUnverifiedCount: totalUnverifiedCount,
      },
    });
  } catch (error) {
    console.error("獲取統計資訊失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
