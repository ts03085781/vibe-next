import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface ContentCardProps {
  id: string;
  title: string;
  coverImage?: string;
  rating: number;
  updateStatus: string;
  updateDate: string;
  tag?: string;
  tagColor?: string;
  onClick?: () => void;
}

export default function ContentCard({
  id,
  title,
  coverImage,
  rating,
  updateStatus,
  updateDate,
  tag,
  tagColor = "bg-orange-500",
  onClick,
}: ContentCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 預設跳轉到閱讀頁面
      router.push(`/read?id=${id}&chapter=1`);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      {/* 上方內容區 - 封面區域 */}
      <div className="relative bg-gray-100 h-56">
        {/* 標籤 */}
        {tag && (
          <div
            className={`absolute top-2 left-2 ${tagColor} text-white px-2 py-1 text-xs font-medium transform -rotate-12 rounded-sm`}
          >
            {tag}
          </div>
        )}

        {/* 封面圖片或佔位符 */}
        <div className="flex items-center justify-center h-full">
          {coverImage ? (
            <Image src={coverImage} alt={title} fill className="object-cover" />
          ) : (
            <div className="text-6xl font-bold text-blue-300">{id}</div>
          )}
        </div>
      </div>

      {/* 下方資訊區 */}
      <div className="p-4">
        {/* 標題 */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{title}</h3>

        {/* 評分和更新狀態 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <span className="text-orange-500">★</span>
            <span className="text-orange-500 font-medium text-sm">{rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-xs">{updateStatus}</span>
        </div>

        {/* 更新日期 */}
        <div className="text-gray-500 text-xs">更新於：{updateDate}</div>
      </div>
    </div>
  );
}
