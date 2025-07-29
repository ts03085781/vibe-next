import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

/**
 * 獲取特定章節的詳細內容
 *
 * @route GET /api/chapters/[id]
 * @param {string} id - 章節的 ObjectId
 * @returns {Object} 章節的完整內容，包含標題、內容、字數等
 */
// GET /api/chapters/[id] 獲取特定章節的詳細內容
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得章節 ID
    const { id } = await params;

    // 取得章節資料
    const chapter = await Chapter.findById(id).lean();

    // 如果章節不存在，則返回 404
    if (!chapter) {
      return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
    }

    // 回傳結果
    return NextResponse.json({
      success: true,
      data: chapter,
    });
  } catch (e) {
    console.error("獲取章節失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
