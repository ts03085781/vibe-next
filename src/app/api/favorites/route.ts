import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import Manga from "@/models/Manga";
import { getUserIdFromToken } from "@/utils/auth"; // 你可以根據自己的驗證方式調整

// GET /api/favorites 取得收藏漫畫
export async function GET(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得當前用戶的 userId
    const userId = getUserIdFromToken(request);

    // 如果 userId 不存在，則返回 401
    if (!userId)
      return NextResponse.json(
        { success: false, error: "帳號未登入或token已過期" },
        { status: 401 }
      );

    // 取得資料庫中指定 userId 的收藏資料
    const favorite = await Favorite.findOne({ userId });

    // 如果收藏資料不存在，則返回空陣列
    if (!favorite || !favorite.favorites || favorite.favorites.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 用 favorites 陣列查詢 Manga 資料
    const mangas = await Manga.find({ _id: { $in: favorite.favorites } });

    // 回傳 Manga 物件陣列
    return NextResponse.json({
      success: true,
      data: mangas,
    });
  } catch (e) {
    console.error("獲取收藏漫畫失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/favorites 新增收藏漫畫
export async function POST(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得當前用戶的 userId
    const userId = getUserIdFromToken(request);

    // 如果 userId 不存在，則返回 401
    if (!userId)
      return NextResponse.json(
        { success: false, error: "帳號未登入或token已過期" },
        { status: 401 }
      );

    // 取得漫畫 ID
    const { mangaId } = await request.json();

    // 如果漫畫 ID 不存在，則返回 400
    if (!mangaId) return NextResponse.json({ success: false, error: "缺少漫畫ID" });

    // 將漫畫 ID 加入收藏資料庫
    await Favorite.updateOne({ userId }, { $addToSet: { favorites: mangaId } }, { upsert: true });

    // 回傳結果
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("新增收藏漫畫失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/favorites 刪除收藏漫畫
export async function DELETE(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得當前用戶的 userId
    const userId = getUserIdFromToken(request);

    // 如果 userId 不存在，則返回 401
    if (!userId)
      return NextResponse.json(
        { success: false, error: "帳號未登入或token已過期" },
        { status: 401 }
      );

    // 取得漫畫 ID
    const { searchParams } = new URL(request.url);
    const mangaId = searchParams.get("mangaId");

    // 如果漫畫 ID 不存在，則返回 400
    if (!mangaId) return NextResponse.json({ success: false, error: "缺少漫畫ID" });

    // 將漫畫 ID 從收藏資料庫中移除
    await Favorite.updateOne({ userId }, { $pull: { favorites: mangaId } });

    // 回傳結果
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("刪除收藏漫畫失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
