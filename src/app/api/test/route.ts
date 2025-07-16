import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

/**
 * 測試 API 端點
 *
 * 功能：測試 MongoDB 資料庫連接是否正常
 * 用途：開發階段除錯用，確認資料庫連接狀態
 *
 * @route GET /api/test
 * @returns {Object} 連接狀態和時間戳記
 */
export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "MongoDB connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
