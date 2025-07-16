"use client";
import React, { useState } from "react";
import FilterPanel, { FilterConfig } from "@/components/FilterPanel";
import SortPanel, { SortOption } from "@/components/SortPanel";
import ContentCard from "@/components/ContentCard";
import filterConfig from "@/constants/filterConfig.json";
import sortConfig from "@/constants/sortConfig.json";
import { mockContentData } from "@/mocks/mockData";

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    region: "all",
    genre: "all",
    audience: "all",
    year: "all",
    alpha: "all",
    status: "all",
  });

  const [selectedSort, setSelectedSort] = useState<string>("latest_release");

  const handleFilterSelect = (categoryKey: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [categoryKey]: value,
    }));
  };

  const handleReset = () => {
    setSelectedFilters({
      region: "all",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <SortPanel
            options={sortConfig as SortOption[]}
            selected={selectedSort}
            onSelect={handleSortSelect}
          />
          <FilterPanel
            config={filterConfig as FilterConfig[]}
            selected={selectedFilters}
            onSelect={handleFilterSelect}
            onReset={handleReset}
          />

          {/* 內容卡片列表 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mockContentData.map(item => (
              <ContentCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
