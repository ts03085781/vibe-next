"use client";

import { useState, useEffect } from "react";
import { useIsLogin } from "@/hooks/commons";
import { apiGet, apiPost } from "@/utils/api";
import { useRouter } from "next/navigation";

interface RatingBlockProps {
  mangaId: string;
  currentRating?: number; // 漫畫的整體平均評分
  onRatingChange?: (newRating: number) => void;
}

export default function RatingBlock({
  mangaId,
  currentRating = 0,
  onRatingChange,
}: RatingBlockProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const isLoggedIn = useIsLogin();
  const router = useRouter();
  // 顯示的評分（hover 或實際評分）
  const displayRating = hoverRating || userRating || 0;

  // 取得用戶的評分
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserRating = async () => {
      try {
        const res = await apiGet(`/api/ratings?mangaId=${mangaId}`);
        const data = await res.json();

        if (data.success && data.data) {
          setUserRating(data.data.rating);
        }
      } catch (error) {
        console.error("取得用戶評分失敗:", error);
      }
    };

    fetchUserRating();
  }, [mangaId, isLoggedIn]);

  // 提交評分
  const handleRatingSubmit = async (rating: number) => {
    if (!isLoggedIn) {
      alert("請先登入會員才能評分唷！");
      router.push("/login");
      return;
    }

    try {
      const res = await apiPost("/api/ratings", { mangaId, rating });
      const data = await res.json();

      if (data.success) {
        setUserRating(rating);
        onRatingChange?.(data.data.averageRating);
        alert("評分成功！");
      } else {
        alert(data.error || "評分失敗");
      }
    } catch (error) {
      console.error("提交評分失敗:", error);
      alert("評分失敗，請稍後再試");
    }
  };

  // 渲染星星
  const renderStars = (rating: number) => {
    const stars = [];
    const maxStars = 10;

    for (let i = 1; i <= maxStars; i++) {
      const starClass = `
        text-sm mr-1 cursor-pointer transition-colors hover:text-orange-500
        ${i <= rating ? "text-orange-500" : "text-gray-300"}`;

      stars.push(
        <span
          key={i}
          className={starClass}
          onClick={() => handleRatingSubmit(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(null)}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="space-y-2">
      {/* 整體平均評分 */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">整體評分:</span>
        <span className="text-sm text-orange-500">{`★ ${currentRating.toFixed(1)}`}</span>
      </div>

      {/* 用戶評分區域 */}
      {isLoggedIn ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">我的評分:</span>
          <div className="flex items-center">
            {renderStars(displayRating)}
            <span className="ml-2 text-sm text-orange-500">{displayRating}/10</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">請登入後才能評分</div>
      )}
    </div>
  );
}
