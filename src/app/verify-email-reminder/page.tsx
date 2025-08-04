"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailReminder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleResendEmail = async () => {
    if (!email) {
      setMessageType("error");
      setMessage("請輸入電子郵件地址");
      return;
    }

    setIsResending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage(data.message);
      } else {
        setMessageType("error");
        setMessage(data.error);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("發送驗證郵件時發生錯誤，請稍後再試");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {/* 郵件圖標 */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">請驗證您的電子郵件</h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            感謝您註冊 VoiceToon！我們已經向您的電子郵件地址發送了驗證連結。
            請檢查您的收件匣（包括垃圾郵件資料夾）並點擊驗證連結來完成註冊。
          </p>

          {/* 電子郵件顯示 */}
          {email && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">驗證郵件已發送至：</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          )}

          {/* 重新發送郵件表單 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-3">沒有收到驗證郵件？</h3>

            <div className="space-y-3">
              {/* <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="請輸入您的電子郵件地址"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              /> */}

              <button
                onClick={handleResendEmail}
                disabled={isResending || !email}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    發送中...
                  </div>
                ) : (
                  "重新發送驗證郵件"
                )}
              </button>
            </div>
          </div>

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
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              前往登入
            </Link>

            <Link
              href="/"
              className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              返回首頁
            </Link>
          </div>

          {/* 提示資訊 */}
          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>• 驗證連結將在 24 小時後失效</p>
            <p>• 請檢查垃圾郵件資料夾</p>
            <p>• 如果問題持續，請聯繫客服</p>
          </div>
        </div>
      </div>
    </div>
  );
}
