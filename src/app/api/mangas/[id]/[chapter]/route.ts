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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapter: string }> }
) {
  try {
    await dbConnect();

    const { id, chapter } = await params;

    // 驗證 ObjectId 格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid manga ID format" },
        { status: 400 }
      );
    }

    const chaptersData = await Chapter.find({ mangaId: id, chapterNumber: chapter }).lean();

    return NextResponse.json({
      success: true,
      data: chaptersData[0],
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
