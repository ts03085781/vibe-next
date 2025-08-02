"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { apiGet, apiPost, apiDelete } from "@/utils/api";
import Link from "next/link";
import { IChapterListItem } from "@/types/creation";
import { MdEdit, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { countWords } from "@/utils/common";

export default function ChaptersPage() {
  const params = useParams();
  const { user } = useUserStore();
  const [chapters, setChapters] = useState<IChapterListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [newChapter, setNewChapter] = useState({
    title: "",
    content: "",
    chapterNumber: 1,
  });

  useEffect(() => {
    if (user && params.id) {
      fetchChapters();
    }
  }, [user, params.id]);

  const fetchChapters = async () => {
    try {
      setError(null);

      const response = await apiGet(`/api/creations/${params.id}/chapters`);
      const data = await response.json();

      if (data.success) {
        setChapters(data.data);
      } else {
        setError(data.error || "獲取章節失敗");
      }
    } catch (error) {
      console.error("獲取章節失敗:", error);
      setError("獲取章節失敗");
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newChapter.title.trim() || !newChapter.content.trim()) {
      setError("請填寫章節標題和內容");
      return;
    }

    if (newChapter.chapterNumber < 1) {
      setError("章節編號必須大於 0");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await apiPost(`/api/creations/${params.id}/chapters`, newChapter);
      const data = await response.json();

      if (data.success) {
        setShowNewChapter(false);
        setNewChapter({ title: "", content: "", chapterNumber: 1 });
        fetchChapters();
      } else {
        setError(data.error || "創建章節失敗");
      }
    } catch (error) {
      console.error("創建章節失敗:", error);
      setError("創建章節失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("確定要刪除這個章節嗎？")) {
      return;
    }

    try {
      setDeleting(chapterId);
      setError(null);

      const response = await apiDelete(`/api/creations/${params.id}/chapters/${chapterId}`);
      const data = await response.json();

      if (data.success) {
        fetchChapters();
      } else {
        setError(data.error || "刪除章節失敗");
      }
    } catch (error) {
      console.error("刪除章節失敗:", error);
      setError("刪除章節失敗，請稍後再試");
    } finally {
      setDeleting(null);
    }
  };

  // 未登入
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-700">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-4 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">章節管理</h1>
          <p className="text-gray-600 mb-4">請先登入以管理章節</p>
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

  // 成功
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-4 max-w-2xl mx-auto">
        {/* 標題區域 */}
        <div className="flex flex-wrap gap-2 items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800">章節管理</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNewChapter(true)}
              className="cursor-pointer text-white font-medium px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600"
            >
              新增章節
            </button>
            <Link
              href="/creation"
              className="text-white font-medium px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              返回創作專區
            </Link>
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* 新增章節 */}
        {showNewChapter && (
          <div className="mb-6 p-6 rounded-lg bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">新增章節</h2>
            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    <span>章節編號 </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newChapter.chapterNumber}
                    onChange={e =>
                      setNewChapter({ ...newChapter, chapterNumber: parseInt(e.target.value) || 1 })
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
                    value={newChapter.title}
                    onChange={e => setNewChapter({ ...newChapter, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="請輸入章節標題"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  <span>章節內容 </span>
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newChapter.content}
                  onChange={e => setNewChapter({ ...newChapter, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入章節內容"
                  required
                />
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewChapter(false)}
                  className="cursor-pointer font-medium px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消創建
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "創建中..." : "創建章節"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 章節列表 */}
        {chapters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">還沒有任何章節</p>
            <button
              onClick={() => setShowNewChapter(true)}
              className="bg-green-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-600"
            >
              新增第一個章節
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chapters.map(chapter => (
              <div
                key={chapter._id}
                className="rounded-lg p-4 hover:shadow-md transition-shadow bg-white rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        第{chapter.chapterNumber}章 - {chapter.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      發布日期: {dayjs(chapter.publishDate).format("YYYY-MM-DD")}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      本章節字數: {countWords(chapter.content)}
                    </p>
                    {/* 章節內容 */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      章節內容：
                      {chapter.content.substring(0, 200)}
                      {chapter.content.length > 200 && "..."}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/creation/${params.id}/chapters/${chapter._id}/edit`}
                      className="text-sm text-gray-500 px-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 px-3 py-2"
                    >
                      <MdEdit className="text-base" />
                    </Link>
                    <button
                      onClick={() => handleDeleteChapter(chapter._id)}
                      disabled={deleting === chapter._id}
                      className="text-sm text-gray-500 px-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 px-3 py-2"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
