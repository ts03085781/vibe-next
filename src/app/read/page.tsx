"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

interface MangaData {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  rating: number;
  totalChapters: number;
  currentChapter: number;
  genre: string[];
  audience?: string;
  status?: string;
  year?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ChapterData {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  publishDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ReadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mangaData, setMangaData] = useState<MangaData | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mangaId = searchParams.get("id");
  const chapterNumber = parseInt(searchParams.get("chapter") || "1");

  // 取得漫畫資訊與章節列表
  useEffect(() => {
    if (!mangaId) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        // 取得漫畫資訊
        const mangaRes = await fetch(`/api/mangas?_id=${mangaId}`);
        const mangaJson = await mangaRes.json();

        if (mangaJson.success && mangaJson.data.length > 0) {
          setMangaData(mangaJson.data[0]);
        } else {
          setError("找不到漫畫唷！");
          setLoading(false);
          return;
        }
        // 取得章節列表
        const chapterRes = await fetch(`/api/mangas/${mangaId}/${chapterNumber}`);
        const chapterJson = await chapterRes.json();
        if (chapterJson.success) {
          setCurrentChapter(chapterJson.data);
        } else {
          setError("找不到章節");
        }
      } catch (e) {
        setError("API 請求失敗");
      }
      setLoading(false);
    };
    fetchData();
  }, [mangaId, chapterNumber]);

  const handleChapterChange = (newChapter: number) => {
    router.push(`/read?id=${mangaId}&chapter=${newChapter}`);
  };

  const handleBackToList = () => {
    router.push("/");
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

  if (error || !mangaData || !currentChapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || "找不到漫畫喔！"}</h1>
          <button
            onClick={handleBackToList}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            返回列表
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
          <Image
            className="rounded-lg"
            src={mangaData.coverImage || ""}
            alt={mangaData.title}
            width={180}
            height={180}
          />
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{mangaData.title}</h1>
              </div>
              <button
                onClick={handleBackToList}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                返回列表
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>評分：{mangaData.rating} ★</span>
              <span>總章節：{mangaData.totalChapters}</span>
              <span>當前章節：{currentChapter.chapterNumber}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
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
            <p className="text-gray-700 text-sm">{mangaData.description}</p>
          </div>
        </div>

        {/* 章節導航 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              第 {currentChapter.chapterNumber} 章：{currentChapter.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>字數：{currentChapter.wordCount}</span>
              <span>發布：{currentChapter.publishDate}</span>
            </div>
          </div>
        </div>

        {/* 章節內容 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {currentChapter.content}
            </div>
          </div>
        </div>

        {/* 導航按鈕 */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleChapterChange(currentChapter.chapterNumber - 1)}
            disabled={currentChapter.chapterNumber <= 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentChapter.chapterNumber <= 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            上一章
          </button>

          <div className="text-center">
            <span className="text-gray-600">
              {currentChapter.chapterNumber} / {mangaData.totalChapters}
            </span>
          </div>

          <button
            onClick={() => handleChapterChange(currentChapter.chapterNumber + 1)}
            disabled={currentChapter.chapterNumber >= mangaData.totalChapters}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentChapter.chapterNumber >= mangaData.totalChapters
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            下一章
          </button>
        </div>
      </div>
    </div>
  );
}
