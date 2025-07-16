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
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    // 驗證 ObjectId 格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid chapter ID format" },
        { status: 400 }
      );
    }

    const chapter = await Chapter.findById(id).lean();

    if (!chapter) {
      return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
