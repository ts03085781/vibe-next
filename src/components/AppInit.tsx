// src/components/AppInit.tsx
"use client";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

// APP 初始化時專用的組,不會渲染任何東西
export default function AppInit() {
  const { login, logout } = useUserStore();
  const preUserRef = useRef<string | null>(null);
  const preTokenRef = useRef<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    // 畫面初始化觸發一次
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    preUserRef.current = user;
    preTokenRef.current = token;
    if (user && token) {
      login(token, JSON.parse(user));
    } else {
      logout();
    }

    // 每秒用interval監測 localStorage,再依據 user 和 token 狀態判斷要觸發登入還是登出
    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      if (user !== preUserRef.current || token !== preTokenRef.current) {
        preUserRef.current = user;
        preTokenRef.current = token;
        if (user && token) {
          login(token, JSON.parse(user));
        } else {
          const memberPages = ["/favorite", "/creation"];
          if (memberPages.includes(window.location.pathname)) {
            router.push("/login");
          }
          logout();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [login, logout, router]);

  return null;
}
