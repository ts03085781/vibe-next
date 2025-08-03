"use client";
import React, { useEffect, useState } from "react";
import ContentCard from "@/components/ContentCard";
import { IManga } from "@/models/Manga";
import { useIsLogin } from "@/hooks/commons";
import { useRouter } from "next/navigation";
import SortPanel from "@/components/SortPanel";
import { sortConfig } from "@/constants/sortConfig";
import { apiGet } from "@/utils/api";
import { MdHome } from "react-icons/md";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<IManga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("latest_release");

  const isLogin = useIsLogin();
  const router = useRouter();
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLogin) return;
      setLoading(true);
      setError("");
      try {
        const res = await apiGet("/api/favorites");
        const data = await res.json();
        if (data.success) {
          setFavorites(data.data || []);
        } else {
          setError(data.error || "載入失敗");
        }
      } catch (e) {
        setError("載入失敗");
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [isLogin]);

  const handleBackToList = () => {
    router.push("/");
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    const sortedFavorites = favorites.sort((a: IManga, b: IManga) => {
      switch (value) {
        case "latest_release":
          return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        case "latest_update":
          return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
        case "most_popular":
          return b.collectionsCount - a.collectionsCount;
        case "highest_rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setFavorites(sortedFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
        {/* 我的收藏庫標題 */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">我的收藏庫</h1>
            <div className="text-gray-600">目前有 {favorites.length} 個收藏</div>
          </div>

          <button
            onClick={handleBackToList}
            className="text-2xl font-bold bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <MdHome />
          </button>
        </div>

        {/* 排序功能 */}
        <SortPanel options={sortConfig} selected={selectedSort} onSelect={handleSortSelect} />

        {/* 載入狀態 */}
        {loading && <div>載入中...</div>}

        {/* 錯誤訊息 */}
        {error && <div className="text-red-500">{error}</div>}

        {/* 沒有收藏 */}
        {!loading && favorites.length === 0 && (
          <div className="text-gray-400 text-center">目前沒有收藏任何漫畫</div>
        )}
        {/* 收藏列表 */}
        <div className="flex flex-wrap sm:flex-row gap-4 justify-center md:justify-start">
          {favorites.map((item: IManga) => (
            <ContentCard key={String(item._id)} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
