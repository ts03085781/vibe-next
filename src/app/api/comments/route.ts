import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { getUserIdFromToken } from "@/utils/auth";

// GET /api/comments?mangaId=xxx&page=1&pageSize=10
export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const mangaId = searchParams.get("mangaId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  if (!mangaId) {
    return NextResponse.json({ success: false, error: "缺少 mangaId" }, { status: 400 });
  }
  try {
    const total = await Comment.countDocuments({ mangaId });
    const comments = await Comment.find({ mangaId })
      .sort({ createdDate: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    return NextResponse.json({ success: true, data: comments, total });
  } catch (e) {
    return NextResponse.json({ success: false, error: "查詢失敗" }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "未登入或 token 無效" }, { status: 401 });
    }
    const body = await req.json();
    const { mangaId, content, username, nickname } = body;
    if (!mangaId || !content || !username || !nickname) {
      return NextResponse.json({ success: false, error: "缺少必要欄位" }, { status: 400 });
    }
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
    return NextResponse.json({ success: true, data: newComment });
  } catch (e) {
    return NextResponse.json({ success: false, error: "留言失敗" }, { status: 500 });
  }
}
