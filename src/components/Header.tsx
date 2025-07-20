"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleBackToList = () => {
    router.push("/");
  };

  const handleSearch = () => {
    if (searchValue === "") {
      alert("請輸入要搜尋的小說名稱唷！");
      return;
    }
    router.push(`/searchResult?keyword=${searchValue}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="bg-gray-800 px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-2">
        {/* Logo 與標題 */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToList}>
          <Image src="/images/logo.png" alt="logo" width={52} height={52} />
          <span className="text-white text-xl font-bold">AI小說坊</span>
        </div>
        {/* 搜尋框 */}
        <div className="flex w-full max-w-[500px]">
          <input
            type="text"
            placeholder="輸入你要搜尋的漫畫名稱"
            className="flex-1 rounded-l-lg px-4 py-2 text-gray-700 focus:outline-none bg-white"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-6 py-2 rounded-r-lg font-bold hover:bg-orange-600 transition-colors"
          >
            搜尋
          </button>
        </div>
        {/* 右側功能連結 */}
        <div className="flex gap-8 text-white text-base font-medium">
          <a href="#" className="hover:underline">
            設為桌面圖標
          </a>
          <a href="#" className="hover:underline">
            收藏看漫畫
          </a>
        </div>
      </div>
      {/* 主選單 */}
      {/* <nav className="flex items-center gap-2 mt-2">
        <button className="text-2xl text-white px-2">☰</button>
        <a href="#" className="text-white px-3 py-2 font-medium">
          漫畫大全導航
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          首頁
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          最新更新
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          排行榜
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          連載漫畫
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          完結漫畫
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          漫畫大全
        </a>
        <a href="#" className="text-white px-3 py-2 font-medium">
          漫畫家
        </a>
        <a href="#" className="bg-orange-500 text-white px-3 py-2 font-medium rounded">
          漫畫隨心看
        </a>
      </nav> */}
    </header>
  );
}
