import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // 前端只需刪除 localStorage 的 token，這裡回傳成功即可
  return NextResponse.json({ success: true, message: "已登出" });
}
