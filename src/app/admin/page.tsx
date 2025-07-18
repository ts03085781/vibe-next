"use client";
import React, { useState } from "react";
import { genreList, audienceList, statusList, yearList, alphaList } from "@/constants/filterConfig";

type Form = {
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  totalChapters: number;
  genre: string[];
  audience: string;
  status: string;
  year: number;
  alpha: string;
  collectionsCount: number;
  tag: string;
};

const initialForm = {
  title: "",
  description: "",
  coverImage: "",
  rating: 0,
  totalChapters: 0,
  genre: [],
  audience: "少年",
  status: "連載",
  year: new Date().getFullYear(),
  alpha: "A",
  collectionsCount: 0,
  tag: "",
};

export default function MangaAdminForm() {
  const [form, setForm] = useState<Form>(initialForm);
  const [message, setMessage] = useState("");

  // 處理表單變化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, multiple, options } = e.target as HTMLSelectElement;
    if (name === "genre" || (name === "status" && multiple)) {
      // 取得所有被選中的 option value
      const selected = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setForm(prev => ({
        ...prev,
        genre: selected,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: ["rating", "totalChapters", "year", "collectionsCount"].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    console.log("payload", payload);
    const res = await fetch("/api/mangas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("新增成功！");
      setForm(initialForm);
    } else {
      setMessage("新增失敗：" + (data.error || "未知錯誤"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 py-8 px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-blue-100"
      >
        <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center tracking-wide">
          新增漫畫
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="font-medium text-gray-700">
              標題<span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              id="title"
              value={form.title}
              onChange={handleChange}
              placeholder="標題"
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2 md:col-span-2">
            <label htmlFor="description" className="font-medium text-gray-700">
              描述<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
              placeholder="描述"
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700 min-h-[60px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="coverImage" className="font-medium text-gray-700">
              封面圖片URL
            </label>
            <input
              name="coverImage"
              id="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="Cloudinary 圖片網址"
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="rating" className="font-medium text-gray-700">
              評分
            </label>
            <input
              name="rating"
              id="rating"
              type="number"
              value={form.rating}
              onChange={handleChange}
              placeholder="0~10"
              min={0}
              max={10}
              step={0.1}
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="totalChapters" className="font-medium text-gray-700">
              總章節數
            </label>
            <input
              name="totalChapters"
              id="totalChapters"
              type="number"
              value={form.totalChapters}
              onChange={handleChange}
              placeholder="總章節數"
              min={0}
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="genre" className="font-medium text-gray-700">
              類型 (可多選)<span className="text-red-500">*</span>
            </label>
            <select
              name="genre"
              id="genre"
              value={form.genre}
              onChange={handleChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
              multiple
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            >
              {genreList.map((genre: { value: string; label: string }) => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="audience" className="font-medium text-gray-700">
              受眾<span className="text-red-500">*</span>
            </label>
            <select
              name="audience"
              id="audience"
              value={form.audience}
              onChange={handleChange}
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            >
              {audienceList.map((audience: { value: string; label: string }) => (
                <option key={audience.value} value={audience.value}>
                  {audience.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="status" className="font-medium text-gray-700">
              狀態<span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              id="status"
              value={form.status}
              onChange={handleChange}
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            >
              {statusList.map((status: { value: string; label: string }) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="year" className="font-medium text-gray-700">
              年份
            </label>
            <select
              name="year"
              id="year"
              value={form.year}
              onChange={handleChange}
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            >
              {yearList.map((year: { value: string; label: string }) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="alpha" className="font-medium text-gray-700">
              字母篩選 <span className="text-red-500">*</span>
            </label>
            <select
              name="alpha"
              id="alpha"
              value={form.alpha}
              onChange={handleChange}
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            >
              {alphaList.map((alpha: { value: string; label: string }) => (
                <option key={alpha.value} value={alpha.value}>
                  {alpha.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="collectionsCount" className="font-medium text-gray-700">
              收藏數
            </label>
            <input
              name="collectionsCount"
              id="collectionsCount"
              type="number"
              value={form.collectionsCount}
              onChange={handleChange}
              placeholder="0"
              min={0}
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="tag" className="font-medium text-gray-700">
              標籤
            </label>
            <input
              name="tag"
              id="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="標籤"
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          送出
        </button>
        {message && (
          <div
            className={`mt-4 text-center font-semibold ${message.includes("成功") ? "text-green-600" : "text-red-500"}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
