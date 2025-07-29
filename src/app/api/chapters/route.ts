import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import mongoose from "mongoose";
import Manga from "@/models/Manga";

// 新增漫畫章節 API
export async function POST(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得章節資料
    const body = await request.json();
    const now = new Date();

    // 建立章節資料
    const chapterData = {
      mangaId: new mongoose.Types.ObjectId(String(body.mangaId)),
      chapterNumber: body.chapterNumber,
      title: body.title,
      content: body.content,
      publishDate: now,
    };

    // 新增章節
    const chapter = new Chapter(chapterData);

    // 儲存章節資料
    await chapter.save();

    // 更新對應漫畫的 updateDate 與 totalChapters
    await Manga.findByIdAndUpdate(
      new mongoose.Types.ObjectId(String(body.mangaId)),
      { updateDate: now, totalChapters: body.chapterNumber },
      { new: true }
    );

    // 回傳結果
    return NextResponse.json({ success: true, data: chapter }, { status: 201 });
  } catch (e) {
    console.error("新增章節失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
