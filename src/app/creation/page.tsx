"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { apiGet } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { ICreationListItem } from "@/types/creation";
import dayjs from "dayjs";

export default function CreationPage() {
  const [creations, setCreations] = useState<ICreationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  const fetchCreations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGet("/api/creations");
      const data = await response.json();

      if (data.success) {
        // API 回應的結構是 { success: true, data: { data: [...], pagination: {...} } }
        const responseData = data.data;
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          // 如果是分頁結構 { data: [...], pagination: {...} }
          setCreations(responseData.data);
        } else if (Array.isArray(responseData)) {
          // 如果是直接陣列
          setCreations(responseData);
        } else {
          setCreations([]);
        }
      } else {
        setError(data.error || "獲取作品失敗");
      }
    } catch (error) {
      console.error("獲取作品失敗:", error);
      setError("獲取作品失敗");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">創作專區</h1>
          <p className="text-gray-600 mb-4">請先登入以使用創作功能</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">我的作品區</h1>
            <div className="text-gray-600">目前有 {creations.length} 個作品</div>
          </div>
          <Link
            href="/creation/new"
            className="bg-orange-500 text-white font-medium px-4 py-2 rounded-lg  hover:bg-orange-600"
          >
            創建新作品
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">載入中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchCreations}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              重新載入
            </button>
          </div>
        ) : creations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">您還沒有任何作品</p>
            <Link
              href="/creation/new"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              創建第一個作品
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {/* 作品列表 */}
            {creations.map(creation => (
              <div
                key={creation._id}
                className="bg-white max-w-[234px] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                {/* 上方內容區 - 封面區域 */}
                <div className="relative bg-gray-100 h-[351px]">
                  {/* 封面圖片或佔位符 */}
                  <div className="flex items-center justify-center h-full">
                    {creation.coverImage ? (
                      creation.coverImage.includes(".mp4") ? (
                        <video
                          src={creation.coverImage}
                          className="object-cover w-full h-full"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <Image
                          src={creation.coverImage}
                          alt={creation.title}
                          width={234}
                          height={351}
                          quality={75}
                          className="object-cover w-[234px] h-[351px]"
                        />
                      )
                    ) : (
                      <div className="text-3xl font-bold text-blue-400">{creation.title}</div>
                    )}
                  </div>

                  {/* 標籤 */}
                  {creation.tag && (
                    <div
                      className={`absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-sm font-medium transform -rotate-10 rounded-sm`}
                    >
                      {creation.tag}
                    </div>
                  )}
                </div>

                {/* 下方資訊區 */}
                <div className="p-4 flex flex-col gap-2">
                  {/* 標題 */}
                  <h3 className="font-bold text-gray-900">{creation.title}</h3>

                  {/* 評分和更新狀態 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-orange-500">★</span>
                      <span className="text-orange-500 font-medium text-sm">
                        {creation.rating?.toFixed(1) || 0}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">{`更新至第 ${creation.totalChapters} 章`}</span>
                  </div>

                  {/* 簡介 */}
                  <div className="text-gray-500 text-xs line-clamp-3">{creation.description}</div>

                  {/* 作者 */}
                  <div className="text-gray-500 text-xs">
                    作者：{`${creation.authorNickname} (${creation.authorUsername})`}
                  </div>

                  {/*發布日期 */}
                  <div className="text-gray-500 text-xs">
                    發布於：{dayjs(creation.createDate).format("YYYY-MM-DD")}
                  </div>

                  {/* 更新日期 */}
                  <div className="text-gray-500 text-xs">
                    更新於：{dayjs(creation.updateDate).format("YYYY-MM-DD")}
                  </div>

                  <Link
                    href={`/creation/${creation._id}`}
                    className="bg-blue-500 text-center text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
                  >
                    編輯作品資訊
                  </Link>
                  <Link
                    href={`/creation/${creation._id}/chapters`}
                    className="bg-orange-500 text-center text-white px-4 py-2 rounded-lg hover:bg-orange-600 mt-1"
                  >
                    章節管理
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
