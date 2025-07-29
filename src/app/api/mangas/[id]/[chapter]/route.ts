import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

/**
 * 獲取特定漫畫的所有章節
 *
 * @route GET /api/mangas/[id]/chapter
 * @param {string} id - 漫畫的 ObjectId
 * @param {string} chapter - 章節編號
 * @returns {Object} 該漫畫的所有章節列表，按章節編號排序
 */
// GET /api/mangas/[id]/chapter 獲取特定漫畫的所有章節
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapter: string }> }
) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得漫畫 ID 和章節編號
    const { id, chapter } = await params;

    // 取得該漫畫的所有章節
    const chaptersData = await Chapter.find({ mangaId: id, chapterNumber: chapter }).lean();

    // 回傳結果
    return NextResponse.json({
      success: true,
      data: chaptersData[0],
    });
  } catch (e) {
    console.error("獲取章節失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
