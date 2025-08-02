import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Manga from "@/models/Manga";
import { ownershipMiddleware, handleApiError, handleApiSuccess } from "@/utils/middleware";

// GET /api/creations/[id]/chapters - 獲取作品的所有章節
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();

    // 檢查作品是否存在
    const manga = await Manga.findById(id);
    if (!manga) {
      return NextResponse.json({ success: false, error: "作品不存在" }, { status: 404 });
    }

    // 獲取所有章節
    const chapters = await Chapter.find({ mangaId: id }).sort({ chapterNumber: 1 }).lean();

    return handleApiSuccess(chapters);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/creations/[id]/chapters - 新增章節
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 所有權驗證
    const { user, error } = await ownershipMiddleware(request, id);
    if (error) return error;

    await dbConnect();

    const body = await request.json();
    const now = new Date();

    // 檢查章節編號是否已存在
    const existingChapter = await Chapter.findOne({
      mangaId: id,
      chapterNumber: body.chapterNumber,
    });

    if (existingChapter) {
      return NextResponse.json({ success: false, error: "章節編號已存在" }, { status: 400 });
    }

    // 建立章節資料
    const chapterData = {
      mangaId: id,
      chapterNumber: body.chapterNumber,
      title: body.title,
      content: body.content,
      publishDate: now,
    };

    // 創建新章節
    const chapter = new Chapter(chapterData);
    await chapter.save();

    // 更新漫畫的章節數和更新時間
    await Manga.findByIdAndUpdate(id, {
      totalChapters: body.chapterNumber,
      updateDate: now,
    });

    return handleApiSuccess(chapter, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
