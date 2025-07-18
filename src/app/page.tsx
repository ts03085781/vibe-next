"use client";
import React, { useState, useEffect } from "react";
import FilterPanel, { FilterConfig } from "@/components/FilterPanel";
import SortPanel, { SortOption } from "@/components/SortPanel";
import ContentCard from "@/components/ContentCard";
import { filterConfig } from "@/constants/filterConfig";
import { sortConfig } from "@/constants/sortConfig";
import { IManga } from "@/models/Manga";

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
  };

  // 組合 API 查詢參數
  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("sort", selectedSort);
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
    });
    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = buildQuery();
        const res = await fetch(`/api/mangas?${query}`);
        const json = await res.json();
        if (json.success) {
          setContentData(json.data);
        } else {
          setError(json.error || "取得資料失敗");
        }
      } catch (e) {
        setError("API 請求失敗");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedSort, selectedFilters]);

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
          {loading && <div>載入中...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {contentData.map((item: IManga) => (
              <ContentCard key={item._id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
