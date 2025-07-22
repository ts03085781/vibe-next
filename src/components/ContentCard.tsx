import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export interface ContentCardProps {
  _id: string;
  title: string;
  coverImage?: string;
  rating: number;
  updateDate: Date;
  createDate: Date;
  totalChapters: number;
  tag?: string;
  description?: string;
}

export default function ContentCard({
  _id,
  title,
  coverImage,
  rating,
  updateDate,
  createDate,
  totalChapters,
  tag,
  description,
}: ContentCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/introduction?id=${_id}`);
  };

  const isVideo = coverImage?.includes(".mp4");

  return (
    <div
      className="bg-white max-w-[200px] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      {/* 上方內容區 - 封面區域 */}
      <div className="relative bg-gray-100 h-[300px] w-[200px]">
        {/* 封面圖片或佔位符 */}
        <div className="flex items-center justify-center h-full relative">
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
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="width:200px"
                className="object-cover"
              />
            )
          ) : (
            <div className="text-3xl font-bold text-blue-400">{title}</div>
          )}
        </div>

        {/* 標籤 */}
        {tag && (
          <div
            className={`absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-sm font-medium transform -rotate-10 rounded-sm`}
          >
            {tag}
          </div>
        )}
      </div>

      {/* 下方資訊區 */}
      <div className="p-4 flex flex-col gap-2">
        {/* 標題 */}
        <h3 className="font-bold text-gray-900">{title}</h3>

        {/* 評分和更新狀態 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-orange-500">★</span>
            <span className="text-orange-500 font-medium text-sm">{rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-xs">{`更新至第 ${totalChapters} 章`}</span>
        </div>

        {/* 簡介 */}
        <div className="text-gray-500 text-xs line-clamp-3">{description}</div>

        {/*發布日期 */}
        <div className="text-gray-500 text-xs">
          發布於：{dayjs(createDate).format("YYYY-MM-DD")}
        </div>

        {/* 更新日期 */}
        <div className="text-gray-500 text-xs">
          更新於：{dayjs(updateDate).format("YYYY-MM-DD")}
        </div>
      </div>
    </div>
  );
}
