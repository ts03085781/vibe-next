import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Rating from "@/models/Rating";
import Manga from "@/models/Manga";
import { getUserIdFromToken } from "@/utils/auth";

// GET /api/ratings?mangaId=xxx 取得用戶對指定漫畫的評分
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "帳號未登入或token已過期" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mangaId = searchParams.get("mangaId");

    if (!mangaId) {
      return NextResponse.json({ success: false, error: "缺少漫畫ID" }, { status: 400 });
    }

    // 查詢用戶對該漫畫的評分
    const userRating = await Rating.findOne({ userId, mangaId });

    return NextResponse.json({
      success: true,
      data: userRating ? { rating: userRating.rating } : null,
    });
  } catch (e) {
    console.error("取得評分失敗:", e);
    return NextResponse.json({ success: false, error: "取得評分失敗" }, { status: 500 });
  }
}

// POST /api/ratings 提交評分
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "帳號未登入或token已過期" },
        { status: 401 }
      );
    }

    const { mangaId, rating } = await request.json();

    if (!mangaId || rating === undefined) {
      return NextResponse.json({ success: false, error: "缺少必要欄位" }, { status: 400 });
    }

    if (rating < 0 || rating > 10) {
      return NextResponse.json({ success: false, error: "評分必須在 0-10 之間" }, { status: 400 });
    }

    // 使用 upsert 來新增或更新評分
    await Rating.findOneAndUpdate({ userId, mangaId }, { rating }, { upsert: true, new: true });

    // 計算該漫畫的平均評分
    const ratings = await Rating.find({ mangaId });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    // 更新漫畫的平均評分
    await Manga.updateOne(
      { _id: mangaId },
      { rating: Math.round(averageRating * 10) / 10 } // 保留一位小數
    );

    return NextResponse.json({
      success: true,
      data: { rating, averageRating: Math.round(averageRating * 10) / 10 },
    });
  } catch (e) {
    console.error("提交評分失敗:", e);
    return NextResponse.json({ success: false, error: "提交評分失敗" }, { status: 500 });
  }
}
