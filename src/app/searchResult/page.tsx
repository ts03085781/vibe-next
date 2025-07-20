"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResultCard from "@/components/SearchResultCard";
import { SearchResultCardProps } from "@/components/SearchResultCard";
import { mockSearchResults } from "@/mocks/searchResultData";
import SortPanel from "@/components/SortPanel";
import { sortConfig } from "@/constants/sortConfig";

const SearchResultPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResultCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("latest_release");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 使用模擬資料進行搜尋
        const filteredResults = mockSearchResults.filter(
          manga =>
            manga.title.toLowerCase().includes(keyword.toLowerCase()) ||
            manga.description.toLowerCase().includes(keyword.toLowerCase()) ||
            manga.genre.some(g => g.toLowerCase().includes(keyword.toLowerCase()))
        );

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500));

        setSearchResults(filteredResults);
      } catch (e) {
        setError("搜尋請求失敗");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  const handleBackToList = () => {
    router.push("/");
  };

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    const sortedSearchResults = searchResults.sort(
      (a: SearchResultCardProps, b: SearchResultCardProps) => {
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
      }
    );
    setSearchResults(sortedSearchResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 搜尋結果標題 */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">搜尋結果列表</h1>
            <div className="text-gray-600">找到 {searchResults.length} 個結果</div>
          </div>

          <button
            onClick={handleBackToList}
            className="text-base font-bold bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            返回首頁
          </button>
        </div>

        {/* 排序功能 */}
        <SortPanel options={sortConfig} selected={selectedSort} onSelect={handleSortSelect} />

        {/* 載入狀態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">搜尋中...</div>
          </div>
        )}
        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-600">{error}</div>
          </div>
        )}
        {/* 搜尋結果列表 */}
        <div className="space-y-4">
          {!loading && !error && searchResults.length === 0 && keyword && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">沒有找到相關結果</div>
              <div className="text-gray-400">請嘗試其他關鍵字</div>
            </div>
          )}

          {!loading && !error && searchResults.length > 0 && (
            <div className="mt-4">
              {searchResults.map(manga => (
                <SearchResultCard key={manga._id} {...manga} />
              ))}
            </div>
          )}

          {!keyword && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">請輸入搜尋關鍵字</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
