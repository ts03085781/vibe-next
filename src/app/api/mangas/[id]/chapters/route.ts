import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

/**
 * 獲取特定漫畫的所有章節
 *
 * @route GET /api/mangas/[id]/chapters
 * @param {string} id - 漫畫的 ObjectId
 * @returns {Object} 該漫畫的所有章節列表，按章節編號排序
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    // 驗證 ObjectId 格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid manga ID format" },
        { status: 400 }
      );
    }

    const chapters = await Chapter.find({ mangaId: id }).sort({ chapterNumber: 1 }).lean();

    return NextResponse.json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
