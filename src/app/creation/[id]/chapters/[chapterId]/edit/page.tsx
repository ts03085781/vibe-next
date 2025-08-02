"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { apiGet, apiPut } from "@/utils/api";
import Link from "next/link";
import { countWords } from "@/utils/common";

export default function EditChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [chapterData, setChapterData] = useState({
    title: "",
    content: "",
    chapterNumber: 1,
  });

  useEffect(() => {
    if (user && params.id && params.chapterId) {
      fetchChapter();
    }
  }, [user, params.id, params.chapterId]);

  const fetchChapter = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiGet(`/api/creations/${params.id}/chapters/${params.chapterId}`);
      const data = await response.json();

      if (data.success) {
        setChapterData({
          title: data.data.title,
          content: data.data.content,
          chapterNumber: data.data.chapterNumber,
        });
      } else {
        setError(data.error || "獲取章節失敗");
      }
    } catch (error) {
      console.error("獲取章節失敗:", error);
      setError("獲取章節失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chapterData.title.trim() || !chapterData.content.trim()) {
      setError("請填寫章節標題和內容");
      return;
    }

    if (chapterData.chapterNumber < 1) {
      setError("章節編號必須大於 0");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await apiPut(
        `/api/creations/${params.id}/chapters/${params.chapterId}`,
        chapterData as unknown as Record<string, unknown>
      );
      const data = await response.json();

      if (data.success) {
        setSuccess("章節更新成功！");
        setTimeout(() => {
          router.push(`/creation/${params.id}/chapters`);
        }, 1500);
      } else {
        setError(data.error || "更新失敗");
      }
    } catch (error) {
      console.error("更新失敗:", error);
      setError("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  // 未登入
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">編輯章節</h1>
          <p className="text-gray-600 mb-4">請先登入以編輯章節</p>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  // 載入中
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 錯誤
  if (error && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">編輯章節</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href={`/creation/${params.id}/chapters`}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            返回章節管理
          </Link>
        </div>
      </div>
    );
  }

  // 成功
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-4 max-w-2xl mx-auto">
        {/* 標題區域 */}
        <div className="flex flex-wrap gap-2 items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800">章節管理</h1>
          <Link
            href={`/creation/${params.id}/chapters`}
            className="text-white font-medium px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            返回章節管理
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* 章節資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                <span>章節編號 </span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={chapterData.chapterNumber}
                onChange={e =>
                  setChapterData({ ...chapterData, chapterNumber: parseInt(e.target.value) || 1 })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-2">
                <span>章節標題 </span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={chapterData.title}
                onChange={e => setChapterData({ ...chapterData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入章節標題"
                required
              />
            </div>
          </div>
          {/* 章節內容 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              <span>章節內容 </span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={chapterData.content}
              onChange={e => setChapterData({ ...chapterData, content: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入章節內容"
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              目前內容字數 : {countWords(chapterData.content)}
            </div>
          </div>

          {/* 按鈕區域 */}
          <div className="flex justify-center space-x-4">
            <Link
              href={`/creation/${params.id}/chapters`}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
            >
              取消更新
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "更新中..." : "更新章節"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
