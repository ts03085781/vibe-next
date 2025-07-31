import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getUserIdFromToken } from "@/utils/auth";

// PUT /api/comments/:id 編輯留言
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得 commentId
    const { id: commentId } = await params;

    // 取得當前用戶的 userId
    const userId = getUserIdFromToken(request);

    // 如果 userId 不存在，則返回 401
    if (!userId) {
      return NextResponse.json({ success: false, error: "未登入或 token 無效" }, { status: 401 });
    }

    // 取得資料庫中指定commentId的留言資料
    const comment = await Comment.findById(commentId);

    // 如果留言不存在，則返回 404
    if (!comment) {
      return NextResponse.json({ success: false, error: "留言不存在" }, { status: 404 });
    }

    // 取得用戶資訊
    const user = await User.findById(userId);

    // 檢查用戶是否為管理員
    const isAdmin = user && user.role === "admin";

    // 如果用戶不是管理員，則檢查用戶是否為留言的作者
    if (comment.userId !== userId && !isAdmin) {
      return NextResponse.json({ success: false, error: "無權限編輯" }, { status: 403 });
    }

    // 取得留言內容
    const body = await request.json();

    // 如果留言內容不存在，則返回 400
    if (!body.content) {
      return NextResponse.json({ success: false, error: "缺少內容" }, { status: 400 });
    }

    // 更新留言內容
    comment.content = body.content;

    // 更新留言更新時間
    comment.updatedDate = new Date();

    // 儲存留言
    await comment.save();

    // 回傳結果
    return NextResponse.json({ success: true, data: comment });
  } catch (e) {
    console.error("編輯失敗:", e);
    return NextResponse.json({ success: false, error: "編輯失敗" }, { status: 500 });
  }
}

// DELETE /api/comments/:id 刪除留言
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 連接資料庫
    await dbConnect();

    // 取得 commentId
    const { id: commentId } = await params;

    // 取得當前用戶的 userId
    const userId = getUserIdFromToken(request);

    // 如果 userId 不存在，則返回 401
    if (!userId) {
      return NextResponse.json({ success: false, error: "未登入或 token 無效" }, { status: 401 });
    }

    // 取得資料庫中指定commentId的留言資料
    const comment = await Comment.findById(commentId);

    // 如果留言不存在，則返回 404
    if (!comment) {
      return NextResponse.json({ success: false, error: "留言不存在" }, { status: 404 });
    }

    // 取得用戶資訊
    const user = await User.findById(userId);

    // 檢查用戶是否為管理員
    const isAdmin = user && user.role === "admin";

    // 如果用戶不是管理員，則檢查用戶是否為留言的作者
    if (comment.userId !== userId && !isAdmin) {
      return NextResponse.json({ success: false, error: "無權限刪除" }, { status: 403 });
    }

    // 刪除留言
    await comment.deleteOne();

    // 回傳結果
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("刪除失敗:", e);
    return NextResponse.json({ success: false, error: "刪除失敗" }, { status: 500 });
  }
}
