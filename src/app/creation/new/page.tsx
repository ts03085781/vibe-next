"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { apiPost } from "@/utils/api";
import Link from "next/link";
import { ICreationForm } from "@/types/creation";
import { genreList, audienceList, statusList, alphaList } from "@/constants/filterConfig";
import CloudinaryUpload from "@/components/CloudinaryUpload";

export default function NewCreationPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ICreationForm>({
    title: "",
    description: "",
    coverImage: "",
    genre: [],
    audience: "",
    status: "",
    alpha: "",
    tag: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("請填寫作品標題和描述");
      return;
    }

    if (formData.genre.length < 1 || formData.genre.length > 4) {
      setError("請選擇1-4個類型");
      return;
    }

    if (!formData.audience || !formData.status || !formData.alpha) {
      setError("請填寫所有必填欄位");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiPost(
        "/api/creations",
        formData as unknown as Record<string, unknown>
      );
      const data = await response.json();

      if (data.success) {
        router.push("/creation");
      } else {
        setError(data.error || "創建失敗");
      }
    } catch (error) {
      console.error("創建失敗:", error);
      setError("創建失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  // 未登入
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">創建新作品</h1>
          <p className="text-gray-600 mb-4">請先登入以創建作品</p>
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
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800">創建新作品</h1>
          <Link
            href="/creation"
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            返回創作專區
          </Link>
        </div>

        {/* 表單區域 */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-4">
          {/* 錯誤訊息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* 作品標題 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2" htmlFor="title">
              <span>作品標題 </span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入作品標題"
              required
            />
          </div>

          {/* 作品描述 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2" htmlFor="description">
              <span>作品描述 </span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入作品描述"
              required
            />
          </div>

          {/* 受眾、狀態、字母篩選 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 受眾 */}
            <div>
              <label className="block font-medium text-gray-700 mb-2" htmlFor="audience">
                <span>受眾 </span>
                <span className="text-red-500">*</span>
              </label>
              <select
                id="audience"
                value={formData.audience}
                onChange={e => setFormData({ ...formData, audience: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">請選擇受眾</option>
                {audienceList.map(audience => (
                  <option key={audience.value} value={audience.value}>
                    {audience.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 狀態 */}
            <div>
              <label className="block font-medium text-gray-700 mb-2" htmlFor="status">
                <span>狀態 </span>
                <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">請選擇狀態</option>
                {statusList.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 字母索引 */}
            <div>
              <label className="block font-medium text-gray-700 mb-2" htmlFor="alpha">
                <span>字母索引 </span>
                <span className="text-red-500">*</span>
              </label>
              <select
                id="alpha"
                value={formData.alpha}
                onChange={e => setFormData({ ...formData, alpha: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">請選擇字母</option>
                {alphaList.map(alpha => (
                  <option key={alpha.value} value={alpha.value}>
                    {alpha.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 標籤 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2" htmlFor="tag">
              <span>標籤 </span>
              <span className="text-red-500">*</span>
            </label>
            <input
              id="tag"
              type="text"
              value={formData.tag}
              onChange={e => setFormData({ ...formData, tag: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入標籤（可選）"
            />
          </div>

          {/* 作品類型 */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              <span>作品類型 </span>
              <span className="text-red-500">*</span>
              <span className="text-gray-400 text-sm">（最少1個,最多4個）</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genreList.map(genre => (
                <label key={genre.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.genre.includes(genre.value)}
                    onChange={() => handleGenreChange(genre.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{genre.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 封面圖片區域 */}
          <div className="flex justify-start mb-10">
            <CloudinaryUpload
              onUpload={url => setFormData(prev => ({ ...prev, coverImage: url }))}
              currentImageUrl={formData.coverImage}
              name="coverImage"
            />
          </div>

          {/* 按鈕區域 */}
          <div className="flex justify-center space-x-4">
            <Link
              href="/creation"
              className="font-medium px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消創建
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer font-medium px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "創建中..." : "創建作品"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
