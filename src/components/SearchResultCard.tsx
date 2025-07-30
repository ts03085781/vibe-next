import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
// 簡化的漫畫資料介面，避免 Mongoose 相關屬性
export interface SearchResultCardProps {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  rating: number;
  totalChapters: number;
  genre: string[];
  audience: string;
  status: string;
  year: number;
  alpha: string;
  createDate: Date;
  updateDate: Date;
  collectionsCount: number;
  tag: string;
}

export default function SearchResultCard({
  _id,
  title,
  coverImage,
  rating,
  updateDate,
  createDate,
  totalChapters,
  tag,
  description,
  genre,
  audience,
  status,
  year,
  alpha,
  collectionsCount,
}: SearchResultCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/introduction?id=${_id}`);
  };

  const isVideo = coverImage?.includes(".mp4");

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 mb-4"
      onClick={handleClick}
    >
      <div className="flex">
        {/* 左側 - 封面圖片 */}
        <div className="relative bg-gray-100 w-[180px]">
          {coverImage ? (
            isVideo ? (
              <video
                src={coverImage}
                className="object-cover w-full h-full"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image src={coverImage} alt={title} fill className="object-cover" />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-2xl font-bold text-blue-400">
              {title}
            </div>
          )}
          {tag && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs font-medium transform -rotate-10 rounded-sm">
              {tag}
            </div>
          )}
        </div>

        {/* 右側 - 詳細資訊 */}
        <div className="w-2/3 p-4 flex flex-col gap-3">
          {/* 標題 */}
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>

          {/* 評分和章節數 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-orange-500 font-medium">{rating.toFixed(1)}</span>
              <span className="text-orange-500">★</span>
            </div>
            <span className="text-gray-600 text-sm">總章節: {totalChapters}</span>
          </div>

          {/* 標籤 */}
          <div className="flex flex-wrap gap-2">
            {genre.slice(0, 3).map((g, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-600 px-2 py-1 text-xs rounded-md"
              >
                {g}
              </span>
            ))}
          </div>

          {/* 詳細資訊 */}
          <div className="space-y-1 text-sm text-gray-500">
            <div>出品年份: {year}</div>
            <div>最新更新: {dayjs(updateDate).format("YYYY-MM-DD")}</div>
            <div>字母索引: {alpha}</div>
            <div>收藏人數: {collectionsCount}</div>
            <div>目前狀態: {status}</div>
          </div>

          {/* 故事描述 */}
          <div className="text-gray-600 text-sm leading-relaxed">
            故事描述:{" "}
            {description && description.length > 50
              ? `${description.substring(0, 50)}...`
              : description}
          </div>
        </div>
      </div>
    </div>
  );
}
