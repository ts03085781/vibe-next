import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth, requireOwnership } from "./auth";

// 權限驗證中間件 - 驗證用戶是否已登入
export async function authMiddleware(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: NextResponse.json({ success: false, error: "未授權" }, { status: 401 }),
    };
  }
}

// 所有權驗證中間件 - 驗證用戶是否為作品所有者
export async function ownershipMiddleware(request: NextRequest, mangaId: string) {
  try {
    const user = await requireOwnership(request, mangaId);
    return { user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "無權限";
    const statusCode = errorMessage === "未授權" ? 401 : 403;

    return {
      user: null,
      error: NextResponse.json({ success: false, error: errorMessage }, { status: statusCode }),
    };
  }
}

// 可選的權限驗證 - 如果用戶已登入則返回用戶資訊，否則返回 null
export async function optionalAuthMiddleware(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: null };
  }
}

// 統一的錯誤處理函數
export function handleApiError(error: unknown): NextResponse {
  console.error("API 錯誤:", error);

  if (error instanceof Error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
}

// 統一的成功回應函數
export function handleApiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}
