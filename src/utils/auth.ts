import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

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
    console.error("getUserIdFromToken error", e);
    return null;
  }
}
