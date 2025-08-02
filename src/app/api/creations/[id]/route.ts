import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Manga from "@/models/Manga";
import Chapter from "@/models/Chapter";
import { ownershipMiddleware, handleApiError, handleApiSuccess } from "@/utils/middleware";

// GET /api/creations/[id] - 獲取作品詳情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();

    const manga = await Manga.findById(id).lean();
    if (!manga) {
      return NextResponse.json({ success: false, error: "作品不存在" }, { status: 404 });
    }

    return handleApiSuccess(manga);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/creations/[id] - 更新作品
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 所有權驗證
    const { user, error } = await ownershipMiddleware(request, id);
    if (error) return error;

    await dbConnect();

    const body = await request.json();
    const now = new Date();

    // 更新作品資料
    const updatedManga = await Manga.findByIdAndUpdate(
      id,
      {
        ...body,
        authorNickname: user.nickname || user.username,
        authorUsername: user.username,
        updateDate: now,
      },
      { new: true }
    );

    return handleApiSuccess(updatedManga);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/creations/[id] - 刪除作品
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 所有權驗證
    const { user, error } = await ownershipMiddleware(request, id);
    if (error) return error;

    await dbConnect();

    // 刪除作品和相關章節
    await Promise.all([Manga.findByIdAndDelete(id), Chapter.deleteMany({ mangaId: id })]);

    return handleApiSuccess({ message: "作品刪除成功" });
  } catch (error) {
    return handleApiError(error);
  }
}
