import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getUserIdFromToken } from "@/utils/auth";

// PUT /api/comments/:id 編輯留言
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const commentId = params.id;
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: "未登入或 token 無效" }, { status: 401 });
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ success: false, error: "留言不存在" }, { status: 404 });
    }
    // 取得用戶資訊
    const user = await User.findById(userId);
    const isAdmin = user && user.role === "admin";
    if (comment.userId !== userId && !isAdmin) {
      return NextResponse.json({ success: false, error: "無權限編輯" }, { status: 403 });
    }
    const body = await req.json();
    if (!body.content) {
      return NextResponse.json({ success: false, error: "缺少內容" }, { status: 400 });
    }
    comment.content = body.content;
    comment.updatedDate = new Date();
    await comment.save();
    return NextResponse.json({ success: true, data: comment });
  } catch (e) {
    return NextResponse.json({ success: false, error: "編輯失敗" }, { status: 500 });
  }
}

// DELETE /api/comments/:id 刪除留言
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const commentId = params.id;
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: "未登入或 token 無效" }, { status: 401 });
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ success: false, error: "留言不存在" }, { status: 404 });
    }
    // 取得用戶資訊
    const user = await User.findById(userId);
    const isAdmin = user && user.role === "admin";
    if (comment.userId !== userId && !isAdmin) {
      return NextResponse.json({ success: false, error: "無權限刪除" }, { status: 403 });
    }
    await comment.deleteOne();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "刪除失敗" }, { status: 500 });
  }
}
