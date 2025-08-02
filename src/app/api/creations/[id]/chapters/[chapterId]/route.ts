import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Manga from "@/models/Manga";
import { ownershipMiddleware, handleApiError, handleApiSuccess } from "@/utils/middleware";

// GET /api/creations/[id]/chapters/[chapterId] - 獲取章節詳情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id, chapterId } = await params;
    await dbConnect();

    // 檢查作品是否存在
    const manga = await Manga.findById(id);
    if (!manga) {
      return NextResponse.json({ success: false, error: "作品不存在" }, { status: 404 });
    }

    // 獲取章節詳情
    const chapter = await Chapter.findById(chapterId).lean();
    if (!chapter) {
      return NextResponse.json({ success: false, error: "章節不存在" }, { status: 404 });
    }

    return handleApiSuccess(chapter);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/creations/[id]/chapters/[chapterId] - 更新章節
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id, chapterId } = await params;

    // 所有權驗證
    const { user, error } = await ownershipMiddleware(request, id);
    if (error) return error;

    await dbConnect();

    const body = await request.json();
    const now = new Date();

    // 檢查章節是否存在
    const existingChapter = await Chapter.findById(chapterId);
    if (!existingChapter) {
      return NextResponse.json({ success: false, error: "章節不存在" }, { status: 404 });
    }

    // 如果章節編號有變更，檢查是否與其他章節衝突
    if (body.chapterNumber && body.chapterNumber !== existingChapter.chapterNumber) {
      const conflictChapter = await Chapter.findOne({
        mangaId: id,
        chapterNumber: body.chapterNumber,
        _id: { $ne: chapterId },
      });

      if (conflictChapter) {
        return NextResponse.json({ success: false, error: "章節編號已存在" }, { status: 400 });
      }
    }

    // 更新章節
    const updatedChapter = await Chapter.findByIdAndUpdate(
      chapterId,
      {
        ...body,
        publishDate: now,
      },
      { new: true }
    );

    // 如果章節編號有變更，更新漫畫的總章節數
    if (body.chapterNumber && body.chapterNumber !== existingChapter.chapterNumber) {
      const maxChapter = await Chapter.findOne({ mangaId: id })
        .sort({ chapterNumber: -1 })
        .limit(1);

      if (maxChapter) {
        await Manga.findByIdAndUpdate(id, {
          totalChapters: maxChapter.chapterNumber,
          updateDate: now,
        });
      }
    }

    return handleApiSuccess(updatedChapter);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/creations/[id]/chapters/[chapterId] - 刪除章節
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id, chapterId } = await params;

    // 所有權驗證
    const { user, error } = await ownershipMiddleware(request, id);
    if (error) return error;

    await dbConnect();

    // 檢查章節是否存在
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return NextResponse.json({ success: false, error: "章節不存在" }, { status: 404 });
    }

    // 刪除章節
    await Chapter.findByIdAndDelete(chapterId);

    // 更新漫畫的總章節數
    const maxChapter = await Chapter.findOne({ mangaId: id }).sort({ chapterNumber: -1 }).limit(1);

    const now = new Date();
    await Manga.findByIdAndUpdate(id, {
      totalChapters: maxChapter ? maxChapter.chapterNumber : 0,
      updateDate: now,
    });

    return handleApiSuccess({ message: "章節刪除成功" });
  } catch (error) {
    return handleApiError(error);
  }
}
