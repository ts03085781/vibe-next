"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CleanupStats {
  expiredUnverifiedCount: number;
  totalUnverifiedCount: number;
}

export default function CleanupPage() {
  const router = useRouter();
  const [stats, setStats] = useState<CleanupStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // 獲取統計資訊
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/auth/cleanup-expired-users");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setMessageType("error");
        setMessage("獲取統計資訊失敗");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("獲取統計資訊時發生錯誤");
    }
  };

  // 執行清理
  const handleCleanup = async () => {
    if (!confirm("確定要清理過期的未驗證用戶嗎？此操作不可撤銷。")) {
      return;
    }

    setIsCleaning(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/cleanup-expired-users", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage(data.message);
        // 重新獲取統計資訊
        await fetchStats();
      } else {
        setMessageType("error");
        setMessage(data.error || "清理失敗");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("執行清理時發生錯誤");
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">用戶資料清理</h1>
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              返回管理後台
            </button>
          </div>

          {/* 統計資訊卡片 */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">過期未驗證用戶</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.expiredUnverifiedCount}
                    </p>
                    <p className="text-sm text-blue-600">24小時內未驗證</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900">總未驗證用戶</h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.totalUnverifiedCount}
                    </p>
                    <p className="text-sm text-orange-600">包含未過期用戶</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 訊息顯示 */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">清理操作</h3>
                <p className="text-gray-600">
                  清理過期的未驗證用戶可以釋放資料庫空間，提高系統性能。
                </p>
              </div>
              <button
                onClick={handleCleanup}
                disabled={isCleaning || isLoading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCleaning ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    清理中...
                  </div>
                ) : (
                  "執行清理"
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">統計資訊</h3>
                <p className="text-gray-600">查看最新的用戶統計資訊</p>
              </div>
              <button
                onClick={fetchStats}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    載入中...
                  </div>
                ) : (
                  "重新整理"
                )}
              </button>
            </div>
          </div>

          {/* 說明資訊 */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">清理說明</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • <strong>過期用戶</strong>：註冊後 24 小時內未驗證電子郵件的用戶
              </p>
              <p>
                • <strong>清理範圍</strong>：僅刪除過期且未驗證的用戶資料
              </p>
              <p>
                • <strong>安全措施</strong>：已驗證的用戶不會被清理
              </p>
              <p>
                • <strong>建議頻率</strong>：建議每天執行一次清理
              </p>
              <p>
                • <strong>自動清理</strong>：系統會在用戶嘗試使用過期連結時自動清理
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
