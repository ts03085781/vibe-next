"use client";
import React, { useState, useEffect } from "react";
import FilterPanel, { FilterConfig } from "@/components/FilterPanel";
import SortPanel, { SortOption } from "@/components/SortPanel";
import ContentCard from "@/components/ContentCard";
import { filterConfig } from "@/constants/filterConfig";
import { sortConfig } from "@/constants/sortConfig";
import { IManga } from "@/models/Manga";
import { apiGet } from "@/utils/api";

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    genre: "all",
    audience: "all",
    year: "all",
    alpha: "all",
    status: "all",
  });

  const [selectedSort, setSelectedSort] = useState<string>("latest_release");
  const [contentData, setContentData] = useState<IManga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterSelect = (categoryKey: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryKey]: value,
    }));
  };

  const handleReset = () => {
    setSelectedFilters({
      genre: "all",
      audience: "all",
      year: "all",
      alpha: "all",
      status: "all",
    });
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    const sortedContentData = contentData.sort((a: IManga, b: IManga) => {
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
    setContentData(sortedContentData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 組合 API 查詢參數
        const params = new URLSearchParams();
        Object.entries(selectedFilters).forEach(([key, value]) => {
          if (value && value !== "all") params.set(key, value);
        });
        const query = params.toString();

        const res = await apiGet(`/api/mangas?${query}`);
        const json = await res.json();
        if (json.success) {
          const sortedData = json.data.sort((a: IManga, b: IManga) => {
            switch (selectedSort) {
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
          setContentData(sortedData);
        } else {
          setError(json.error || "取得資料失敗");
        }
      } catch (e) {
        setError("API 請求失敗");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* 過濾器 */}
          <FilterPanel
            config={filterConfig as FilterConfig[]}
            selected={selectedFilters}
            onSelect={handleFilterSelect}
            onReset={handleReset}
          />

          {/* 排序 */}
          <SortPanel
            options={sortConfig as SortOption[]}
            selected={selectedSort}
            onSelect={handleSortSelect}
          />

          {/* 內容卡片列表 */}
          {loading && <div className="text-center text-2xl font-bold text-gray-500">載入中...</div>}

          {/* 錯誤訊息 */}
          {error && <div className="text-red-500">{error}</div>}

          {/* 內容卡片列表 */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {contentData.map((item: IManga) => (
              <ContentCard key={item._id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
