import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { getUserIdFromToken } from "@/utils/auth";

// GET /api/comments?mangaId=xxx&page=1&pageSize=10&sort=latest 取得留言
export async function GET(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得 query 參數
    const { searchParams } = new URL(request.url);
    const mangaId = searchParams.get("mangaId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const sort = searchParams.get("sort") || "latest";

    // 如果 mangaId 不存在，則返回 400
    if (!mangaId) {
      return NextResponse.json({ success: false, error: "缺少 mangaId" }, { status: 400 });
    }

    // 取得留言總數
    const total = await Comment.countDocuments({ mangaId });

    let comments;

    if (sort === "popular") {
      // 熱門排序：根據 likes 陣列長度排序
      comments = await Comment.aggregate([
        { $match: { mangaId } },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: -1 } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ]);
    } else {
      // 最新排序：根據建立時間排序
      comments = await Comment.find({ mangaId })
        .sort({ createdDate: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();
    }

    // 回傳結果
    return NextResponse.json({ success: true, data: comments, total });
  } catch (e) {
    console.error("查詢失敗:", e);
    return NextResponse.json({ success: false, error: "查詢失敗" }, { status: 500 });
  }
}

// POST /api/comments 新增留言
export async function POST(request: NextRequest) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得當前用戶的 userId
    const userId = getUserIdFromToken(request);

    // 如果 userId 不存在，則返回 401
    if (!userId) {
      return NextResponse.json({ success: false, error: "未登入或 token 無效" }, { status: 401 });
    }

    // 取得留言內容
    const body = await request.json();

    // 如果留言內容不存在，則返回 400
    const { mangaId, content, username, nickname } = body;
    if (!mangaId || !content || !username || !nickname) {
      return NextResponse.json({ success: false, error: "缺少必要欄位" }, { status: 400 });
    }

    // 新增留言資料到資料庫
    const newComment = await Comment.create({
      mangaId,
      userId,
      username,
      nickname,
      content,
      createdDate: new Date(),
      updatedDate: new Date(),
      likes: [],
    });

    // 回傳結果
    return NextResponse.json({ success: true, data: newComment });
  } catch (e) {
    console.error("新增留言失敗:", e);
    return NextResponse.json({ success: false, error: "留言失敗" }, { status: 500 });
  }
}
