import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { getUserIdFromToken } from "@/utils/auth";

// POST /api/comments/:id/like
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
    const liked = comment.likes.includes(userId);
    if (liked) {
      // 取消讚
      comment.likes = comment.likes.filter((id: string) => id !== userId);
    } else {
      // 按讚
      comment.likes.push(userId);
    }
    await comment.save();
    return NextResponse.json({ success: true, liked: !liked, likeCount: comment.likes.length });
  } catch (e) {
    return NextResponse.json({ success: false, error: "操作失敗" }, { status: 500 });
  }
}
