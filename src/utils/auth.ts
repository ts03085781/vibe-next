import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Manga from "@/models/Manga";
import User from "@/models/User";

// 從 accessToken 中取得 userId
export function getUserIdFromToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const accessToken = authHeader.replace("Bearer ", "");
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET 未設定");
      return null;
    }
    const payload = jwt.verify(accessToken, secret) as { userId?: string; id?: string };
    // 兼容 payload 可能是 userId 或 id
    return payload.userId || payload.id || null;
  } catch (e) {
    // Token 過期或其他錯誤，返回 null
    console.error("getUserIdFromToken error", e);
    return null;
  }
}

// 驗證用戶是否為作品的所有者
export async function verifyUserOwnership(mangaId: string, userId: string): Promise<boolean> {
  try {
    await dbConnect();
    const manga = await Manga.findById(mangaId);
    return manga?.authorId?.toString() === userId;
  } catch (error) {
    console.error("驗證用戶所有權失敗:", error);
    return false;
  }
}

// 獲取當前用戶資訊
export async function getCurrentUser(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return null;

    await dbConnect();
    return await User.findById(userId);
  } catch (error) {
    console.error("獲取當前用戶失敗:", error);
    return null;
  }
}

// 驗證用戶是否已登入
export async function requireAuth(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error("未授權");
  }
  return user;
}

// 驗證用戶是否為作品所有者（組合函數）
export async function requireOwnership(req: NextRequest, mangaId: string) {
  const user = await requireAuth(req);
  const isOwner = await verifyUserOwnership(mangaId, user._id.toString());
  if (!isOwner) {
    throw new Error("無權限");
  }
  return user;
}
