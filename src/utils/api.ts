import { useUserStore } from "@/store/userStore";

// API 呼叫工具函數，支援自動刷新 Token
export const apiCall = async (url: string, options: RequestInit = {}) => {
  // 取得 accessToken 和 refreshAccessToken 和 logout 函數
  const { accessToken, refreshAccessToken, logout } = useUserStore.getState();

  // 建立一個請求函數，帶入 token
  const makeRequest = async (token: string) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  try {
    // 發送請求
    const response = await makeRequest(accessToken || "");

    if (response.status === 401) {
      // Access Token 過期，嘗試刷新
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // 再次發送請求
        const newToken = useUserStore.getState().accessToken;
        return await makeRequest(newToken || "");
      } else {
        // 刷新失敗，登出
        logout();
        // window.location.href = "/login";
        throw new Error("Authentication failed");
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// 簡化的 API 呼叫函數
export const apiGet = (url: string) => apiCall(url, { method: "GET" });
export const apiPost = (url: string, data: Record<string, unknown>) =>
  apiCall(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
export const apiPut = (url: string, data: Record<string, unknown>) =>
  apiCall(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
export const apiDelete = (url: string) => apiCall(url, { method: "DELETE" });
