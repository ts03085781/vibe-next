import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { getUserIdFromToken } from "@/utils/auth";

// POST /api/comments/:id/like
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // 檢查 userId 用戶是否已按讚，如果已按讚，則取消讚，如果未按讚，則按讚
    const liked = comment.likes.includes(userId);
    if (liked) {
      // 取消讚
      comment.likes = comment.likes.filter((id: string) => id !== userId);
    } else {
      // 按讚
      comment.likes.push(userId);
    }

    // 儲存留言
    await comment.save();

    // 回傳結果
    return NextResponse.json({ success: true, liked: !liked, likeCount: comment.likes.length });
  } catch (e) {
    console.error("操作失敗:", e);
    return NextResponse.json({ success: false, error: "操作失敗" }, { status: 500 });
  }
}
