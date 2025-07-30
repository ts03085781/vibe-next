"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { useIsLogin } from "@/hooks/commons";
import { IoSearch } from "react-icons/io5";

export default function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const { user, logout } = useUserStore();
  const isLogin = useIsLogin();

  // 返回列表
  const handleBackToList = () => {
    router.push("/");
  };

  // 搜尋小說標題
  const handleSearch = () => {
    if (searchValue === "") {
      alert("請輸入要搜尋的小說名稱唷！");
      return;
    }
    router.push(`/searchResult?keyword=${searchValue}`);
  };

  // 按下 Enter 鍵觸發搜尋
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 設為桌面圖標
  const handleDownloadShortcut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 阻止預設行為
    const url = window.location.origin; // 獲取當前頁面的 URL
    const shortcutContent = `[InternetShortcut]\nURL=${url}\n`; // 創建快捷方式的內容
    const blob = new Blob([shortcutContent], { type: "text/plain" }); // 創建一個 Blob 對象
    const a = document.createElement("a"); // 創建一個 a 元素
    a.href = URL.createObjectURL(blob); // 設置 a 元素的 href 屬性
    a.download = "AI小說坊.url"; // 設置 a 元素的 download 屬性
    document.body.appendChild(a); // 將 a 元素添加到 body 中
    a.click(); // 觸發 a 元素的 click 事件
    document.body.removeChild(a); // 將 a 元素從 body 中移除
  };

  // 登出
  const handleLogout = () => {
    if (confirm("是否確認要登出？")) {
      logout();
    }
  };

  // 檢查是否登入
  const preCheckLogin = (path: string) => {
    if (isLogin) {
      router.push(path);
    } else {
      alert("請先登入會員唷！");
      router.push("/login");
    }
  };

  return (
    <header className="bg-gray-800 px-5 pt-4 pb-2">
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
            <IoSearch />
          </button>
        </div>
        {/* 右側功能連結 */}
        <div className="flex gap-8 text-white text-base font-medium">
          {isLogin ? (
            <>
              {" "}
              <span>{`Hi ${user?.nickname}`}</span>
              <span className="cursor-pointer" onClick={handleLogout}>
                登出
              </span>
            </>
          ) : (
            <>
              <Link href="/login">登入</Link>
              <Link href="/register">註冊</Link>
            </>
          )}
          <span className="cursor-pointer" onClick={() => preCheckLogin("/favorite")}>
            收藏庫
          </span>
          <span className="cursor-pointer" onClick={handleDownloadShortcut}>
            設為桌面圖標
          </span>
          {isLogin && <span className="cursor-pointer">設定</span>}
        </div>
      </div>
    </header>
  );
}
