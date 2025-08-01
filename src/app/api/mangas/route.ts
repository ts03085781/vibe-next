import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Manga from "@/models/Manga";
import mongoose from "mongoose";

/**
 * 漫畫管理 API 端點
 *
 * 功能：處理漫畫的查詢和創建
 * 支援：篩選、排序、分頁、搜尋
 */

/**
 * 獲取漫畫列表
 *
 * @route GET /api/mangas
 * @param {string} _id - 漫畫 ID
 * @param {string} page - 頁碼 (預設: 1)
 * @param {string} limit - 每頁數量 (預設: 20)
 * @param {string} genre - 類型篩選
 * @param {string} audience - 受眾篩選
 * @param {string} year - 年份篩選
 * @param {string} status - 狀態篩選
 * @returns {Object} 漫畫列表和分頁資訊
 */
// GET /api/mangas 獲取漫畫列表
export async function GET(request: NextRequest) {
  // 連接資料庫
  await dbConnect();

  try {
    // 取得 query 參數
    const { searchParams } = new URL(request.url);

    // 獲取查詢參數，如果沒有則使用預設值
    const _id = searchParams.get("_id");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const genre = searchParams.get("genre");
    const audience = searchParams.get("audience");
    const year = searchParams.get("year");
    const status = searchParams.get("status");
    const alpha = searchParams.get("alpha");

    const query: Record<string, unknown> = {};

    if (_id) {
      query._id = new mongoose.Types.ObjectId(_id);
    }

    if (genre && genre !== "all") {
      query.genre = { $in: [genre] };
    }

    if (audience && audience !== "all") {
      query.audience = audience;
    }

    if (year && year !== "all") {
      query.year = parseInt(year);
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (alpha && alpha !== "all") {
      query.alpha = alpha;
    }

    // 模糊搜尋功能
    if (search) {
      // 使用正則表達式進行模糊搜尋，不區分大小寫
      query.title = { $regex: search, $options: "i" };
    }

    // 計算跳過的數量
    const skip = (page - 1) * limit;

    // 執行查詢
    const [mangas, total] = await Promise.all([
      Manga.find(query).skip(skip).limit(limit).lean(),
      Manga.countDocuments(query),
    ]);

    // 計算分頁資訊
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // 回傳結果
    return NextResponse.json({
      success: true,
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
  } catch (e) {
    console.error("獲取漫畫列表失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * 創建新漫畫
 *
 * @route POST /api/mangas
 * @param {Object} body - 漫畫資料
 * @param {string} body.title - 漫畫標題 (必填)
 * @param {string} body.description - 描述
 * @param {number} body.rating - 評分
 * @param {string[]} body.genre - 類型陣列
 * @param {string} body.status - 狀態
 * @param {number} body.year - 年份
 * @param {string} body.alpha - 字母篩選
 * @param {string} body.coverImage - 封面圖片
 * @param {number} body.totalChapters - 總章節數
 * @param {string} body.audience - 受眾
 * @param {Date} body.createDate - 發布日期
 * @param {Date} body.updateDate - 更新日期
 * @param {number} body.collectionsCount - 收藏數
 * @returns {Object} 創建的漫畫資料
 */
// POST /api/mangas 創建新漫畫
export async function POST(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得漫畫資料
    const body = await request.json();

    // 自動補上當前時間
    const now = new Date();
    const mangaData = {
      ...body,
      rating: 0,
      year: now.getFullYear(),
      totalChapters: 0,
      createDate: now,
      updateDate: now,
    };

    // 建立新漫畫
    const manga = new Manga(mangaData);
    await manga.save();

    // 回傳結果
    return NextResponse.json(
      {
        success: true,
        data: manga,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("創建漫畫失敗:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
