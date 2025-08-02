"use client";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import Image from "next/image";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
  name?: string;
}

export default function CloudinaryUpload({
  onUpload,
  currentImageUrl,
  name,
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (result: any) => {
    console.log("###", result);
    if (result.event === "success" && result.info?.secure_url) {
      const imageUrl = result.info.secure_url;
      onUpload(imageUrl);
      setIsUploading(false);
    } else if (result.event === "upload_added") {
      setIsUploading(true);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* 上傳組件 */}
      <label className="font-medium text-gray-700" htmlFor={name}>
        上傳新封面圖片<span className="text-red-500">*</span>
      </label>

      {/* 上傳圖片 */}
      <div className={`${currentImageUrl ? "hidden" : ""}`}>
        <CldUploadWidget
          uploadPreset="manga_covers"
          onSuccess={result => handleUpload(result)}
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "mp4"],
            maxFileSize: 10000000, // 10MB
            // folder: "manga-covers", // 可選：指定上傳資料夾
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={isUploading}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-gray-600">點擊上傳圖片</span>
                <span className="text-red-400 text-sm">
                  建議格式: 寬240px 高360px (寬高比例: 2:3)
                </span>
                <span className="text-xs text-gray-400">
                  支援 JPG, PNG, GIF, WebP ,MP4 (最大 10MB)
                </span>
              </div>
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* 當前圖片預覽 */}
      <div className={`${currentImageUrl ? "" : "hidden"}`}>
        <div className="relative w-60 h-90 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
          {currentImageUrl && (
            <Image src={currentImageUrl} alt="封面預覽" fill className="object-cover" />
          )}
        </div>
      </div>

      {/* URL 輸入欄位（用於表單提交） */}
      <input
        className="text-gray-500"
        name={name}
        id={name}
        defaultValue={currentImageUrl}
        required
        readOnly
      />

      {/* 清除按鈕 */}
      {currentImageUrl && (
        <button
          type="button"
          onClick={() => onUpload("")}
          className="cursor-pointer font-medium w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          清除圖片
        </button>
      )}
    </div>
  );
}
