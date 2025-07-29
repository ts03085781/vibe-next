"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { useIsLogin } from "@/hooks/commons";
import { addToFavorites, removeFromFavorites } from "@/utils/favorite";
import CommentBoard from "@/components/CommentBoard";
import { useUserStore } from "@/store/userStore";
import { apiGet } from "@/utils/api";

interface MangaData {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  rating: number;
  totalChapters: number;
  genre: string[];
  audience?: string;
  status?: string;
  year?: number;
  alpha?: string;
  createDate?: Date;
  updateDate?: Date;
}
export default function IntroductionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mangaData, setMangaData] = useState<MangaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MangaData[]>([]);
  const isLogin = useIsLogin();
  const { user } = useUserStore();

  const mangaId = searchParams.get("id");
  const isVideo = mangaData?.coverImage?.includes(".mp4");

  // 取得漫畫資訊與章節列表
  useEffect(() => {
    if (!mangaId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        // 取得漫畫資訊
        const mangaRes = await apiGet(`/api/mangas?_id=${mangaId}`);
        const mangaJson = await mangaRes.json();

        if (mangaJson.success && mangaJson.data.length > 0) {
          setMangaData(mangaJson.data[0]);
        } else {
          setError("找不到小說唷！");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("載入漫畫資訊失敗:", err);
        setError("API 請求失敗");
      }
      setLoading(false);
    };

    const fetchFavorites = async () => {
      if (!isLogin) return;
      setLoading(true);
      setError(null);
      try {
        const res = await apiGet("/api/favorites");
        const data = await res.json();
        if (data.success) {
          setFavorites(data.data || []);
        } else {
          setError(data.error || "載入失敗");
        }
      } catch (err) {
        console.error("載入收藏漫畫失敗:", err);
        setError("載入失敗");
      }
      setLoading(false);
    };

    fetchData();
    fetchFavorites();
  }, [mangaId, isLogin]);

  const handleChapterChange = (newChapter: number) => {
    router.push(`/introduction/chapter?id=${mangaId}&chapter=${newChapter}`);
  };

  const handleBackToList = () => {
    router.push("/");
  };

  const handleAddToFavorites = () => {
    if (isLogin) {
      if (mangaData?._id) {
        addToFavorites(mangaData._id);
        setFavorites([...favorites, mangaData]);
      }
    } else {
      alert("請先登入會用唷！");
      router.push("/login");
    }
  };

  const handleRemoveFromFavorites = () => {
    if (mangaData?._id) {
      removeFromFavorites(mangaData._id);
      setFavorites(favorites.filter(favorite => favorite._id !== mangaData._id));
    }
  };

  const isAlreadyInFavorites = () => {
    return favorites.some(favorite => favorite._id === mangaData?._id);
  };

  const showRemoveFromFavorites = () => {
    return isLogin && isAlreadyInFavorites();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !mangaData || !mangaId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">{error || "找不到小說喔！"}</h1>
          <button
            onClick={handleBackToList}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 漫畫資訊區 */}
        <div className="flex gap-4 bg-white rounded-lg shadow-md p-6 mb-6">
          {mangaData.coverImage ? (
            isVideo ? (
              <video
                src={mangaData.coverImage}
                className="object-cover w-[280px] rounded-lg "
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                src={mangaData.coverImage}
                alt={mangaData.title}
                width={280}
                height={280}
                className="object-cover rounded-lg"
              />
            )
          ) : (
            <div className="text-3xl font-bold text-blue-400">{mangaData.title}</div>
          )}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{mangaData.title}</h1>
              </div>
              <div className="flex gap-2">
                {showRemoveFromFavorites() ? (
                  <button
                    onClick={handleRemoveFromFavorites}
                    className="bg-gray-400 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                  >
                    取消收藏
                  </button>
                ) : (
                  <button
                    onClick={handleAddToFavorites}
                    className="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    加入收藏
                  </button>
                )}

                <button
                  onClick={handleBackToList}
                  className="bg-gray-400 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  返回首頁
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-s text-gray-700 mb-3">
              <span className="text-orange-500">評分：{mangaData.rating} ★</span>
              <span>總章節：{mangaData.totalChapters}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {mangaData.genre &&
                mangaData.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs"
                  >
                    {genre}
                  </span>
                ))}
            </div>
            <p className="text-gray-600 text-sm mb-2">
              出品年份: {dayjs(mangaData.createDate).format("YYYY-MM-DD")}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              最新更新: {dayjs(mangaData.updateDate).format("YYYY-MM-DD")}
            </p>
            <p className="text-gray-600 text-sm mb-2">字母索引: {mangaData.alpha}</p>
            <p className="text-gray-600 text-sm mb-4">目前狀態: {mangaData.status}</p>
            <p className="text-gray-600 text-sm">故事描述: {mangaData.description}</p>
          </div>
        </div>

        {/* 章節列表 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">章節列表</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: mangaData.totalChapters }, (_, index) => (
              <div
                key={index}
                className="w-[84px] text-center border border-gray-300 rounded-md cursor-pointer text-gray-700 pt-2 pb-2 hover:bg-orange-50"
                onClick={() => handleChapterChange(index + 1)}
              >
                <span>{`第${index + 1}章`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 留言板 */}
        <CommentBoard
          mangaId={mangaId}
          currentUser={
            isLogin && user
              ? {
                  userId: user._id,
                  username: user.username,
                  nickname: user.nickname,
                  role: user.role,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
