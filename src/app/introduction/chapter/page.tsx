"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { countWords } from "@/utils/common";
import dayjs from "dayjs";
import { apiGet } from "@/utils/api";
import { TbPlayerPlayFilled, TbPlayerPauseFilled, TbPlayerStopFilled } from "react-icons/tb";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { TbArrowBackUp } from "react-icons/tb";

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
  alpha?: string;
  createDate?: Date;
  updateDate?: Date;
}

interface ChapterData {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  content: string;
  publishDate: Date;
}

enum SpeakingStatus {
  SPEAKING = "speaking",
  PAUSED = "paused",
  STOPPED = "stopped",
}

function ChapterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mangaData, setMangaData] = useState<MangaData | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speakingStatus, setSpeakingStatus] = useState<SpeakingStatus>(SpeakingStatus.STOPPED);

  const mangaId = searchParams.get("id");
  const chapterNumber = parseInt(searchParams.get("chapter") || "1");

  const resetSpeakingStatus = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingStatus(SpeakingStatus.STOPPED);
    }
  };

  // 取得漫畫資訊與章節列表
  useEffect(() => {
    if (!mangaId) return;
    setLoading(true);
    setError(null);
    resetSpeakingStatus();

    const fetchData = async () => {
      try {
        // 取得漫畫資訊
        const mangaRes = await apiGet(`/api/mangas?_id=${mangaId}`);
        const mangaJson = await mangaRes.json();

        if (mangaJson.success && mangaJson.data.length > 0) {
          setMangaData(mangaJson.data[0]);
        } else {
          setError("找不到章節唷！");
          setLoading(false);
          return;
        }
        // 取得章節列表
        const chapterRes = await apiGet(`/api/mangas/${mangaId}/${chapterNumber}`);
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

  // 離開頁面時重置朗讀狀態
  useEffect(() => {
    return () => {
      resetSpeakingStatus();
    };
  }, []);

  const handleChapterChange = (newChapter: number) => {
    router.push(`/introduction/chapter?id=${mangaId}&chapter=${newChapter}`);
  };

  const handleBackToList = () => {
    router.push(`/introduction?id=${mangaId}`);
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
          <h1 className="text-2xl text-gray-800 mb-4">{error || "找不到小說喔！"}</h1>
          <button
            onClick={handleBackToList}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <TbArrowBackUp />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 章節導航 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              第 {currentChapter.chapterNumber} 章：{currentChapter.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>本章字數: {countWords(currentChapter.content)}</span>
              <span>發布於: {dayjs(currentChapter.publishDate).format("YYYY-MM-DD")}</span>
              <button
                onClick={handleBackToList}
                className="text-2xl font-bold bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
              >
                <TbArrowBackUp />
              </button>
            </div>
          </div>
        </div>

        {/* 章節內容 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed prose max-w-none mb-6">
            {currentChapter.content}
          </div>
          <div className="flex gap-4 justify-center">
            {speakingStatus === SpeakingStatus.STOPPED && (
              <button
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                onClick={() => {
                  const utter = new window.SpeechSynthesisUtterance(currentChapter.content);
                  utter.lang = "zh-TW";
                  utter.pitch = 0.5;
                  window.speechSynthesis.speak(utter);
                  setSpeakingStatus(SpeakingStatus.SPEAKING);
                }}
              >
                <TbPlayerPlayFilled />
              </button>
            )}
            {speakingStatus === SpeakingStatus.SPEAKING && (
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                onClick={() => {
                  window.speechSynthesis.pause();
                  setSpeakingStatus(SpeakingStatus.PAUSED);
                }}
              >
                <TbPlayerPauseFilled />
              </button>
            )}
            {speakingStatus === SpeakingStatus.PAUSED && (
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                onClick={() => {
                  window.speechSynthesis.resume();
                  setSpeakingStatus(SpeakingStatus.SPEAKING);
                }}
              >
                <TbPlayerPlayFilled />
              </button>
            )}
            {(speakingStatus === SpeakingStatus.SPEAKING ||
              speakingStatus === SpeakingStatus.PAUSED) && (
              <button
                className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setSpeakingStatus(SpeakingStatus.STOPPED);
                }}
              >
                <TbPlayerStopFilled />
              </button>
            )}
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
            <FaChevronLeft />
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
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChapterPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">載入中...</div>}>
      <ChapterContent />
    </Suspense>
  );
}
