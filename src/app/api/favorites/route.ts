import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import Manga from "@/models/Manga";
import { getUserIdFromToken } from "@/utils/auth"; // 你可以根據自己的驗證方式調整

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ success: false, error: "未登入" });

  // 1. 取得 Favorite
  const favorite = await Favorite.findOne({ userId });
  if (!favorite || !favorite.favorites || favorite.favorites.length === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  // 2. 用 favorites 陣列查詢 Manga
  const mangas = await Manga.find({ _id: { $in: favorite.favorites } });

  // 3. 回傳 Manga 物件陣列
  return NextResponse.json({
    success: true,
    data: mangas,
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ success: false, error: "未登入" });

  const { mangaId } = await req.json();
  if (!mangaId) return NextResponse.json({ success: false, error: "缺少漫畫ID" });

  // $addToSet 可避免重複加入
  await Favorite.updateOne({ userId }, { $addToSet: { favorites: mangaId } }, { upsert: true });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ success: false, error: "未登入" });

  const { mangaId } = await req.json();
  if (!mangaId) return NextResponse.json({ success: false, error: "缺少漫畫ID" });

  // $pull 會將指定 mangaId 從 favorites 陣列移除
  await Favorite.updateOne({ userId }, { $pull: { favorites: mangaId } });

  return NextResponse.json({ success: true });
}
