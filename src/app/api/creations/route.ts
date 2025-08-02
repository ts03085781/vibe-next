import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Manga from "@/models/Manga";
import { authMiddleware, handleApiError, handleApiSuccess } from "@/utils/middleware";

// GET /api/creations - 獲取我的作品列表
export async function GET(request: NextRequest) {
  try {
    // 權限驗證
    const { user, error } = await authMiddleware(request);
    if (error) return error;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    // 建立查詢條件
    const query = { authorId: user._id, status: status || "all" };

    const skip = (page - 1) * limit;

    // 執行查詢
    const [mangas, total] = await Promise.all([
      Manga.find(query).sort({ updateDate: -1 }).skip(skip).limit(limit).lean(),
      Manga.countDocuments(query),
    ]);

    // 計算分頁資訊
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return handleApiSuccess({
      data: mangas,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/creations - 創建新作品
export async function POST(request: NextRequest) {
  try {
    // 權限驗證
    const { user, error } = await authMiddleware(request);
    if (error) return error;

    await dbConnect();

    const body = await request.json();
    const now = new Date();

    // 建立作品資料
    const mangaData = {
      ...body,
      authorId: user._id,
      authorNickname: user.nickname || user.username,
      authorUsername: user.username,
      rating: 0,
      totalChapters: 0,
      year: now.getFullYear(),
      createDate: now,
      updateDate: now,
    };

    // 創建新作品
    const manga = new Manga(mangaData);
    await manga.save();

    return handleApiSuccess(manga, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
