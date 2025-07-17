"use client";
import React, { useState } from "react";

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
              <option value="熱血">熱血</option>
              <option value="冒險">冒險</option>
              <option value="推理">推理</option>
              <option value="懸疑">懸疑</option>
              <option value="恐怖">恐怖</option>
              <option value="神鬼">神鬼</option>
              <option value="搞笑">搞笑</option>
              <option value="愛情">愛情</option>
              <option value="科幻">科幻</option>
              <option value="魔法">魔法</option>
              <option value="格鬥">格鬥</option>
              <option value="武俠">武俠</option>
              <option value="戰爭">戰爭</option>
              <option value="競技">競技</option>
              <option value="體育">體育</option>
              <option value="校園">校園</option>
              <option value="生活">生活</option>
              <option value="勵志">勵志</option>
              <option value="歷史">歷史</option>
              <option value="宅男">宅男</option>
              <option value="腐女">腐女</option>
              <option value="治癒">治癒</option>
              <option value="美食">美食</option>
              <option value="社會">社會</option>
              <option value="音樂">音樂</option>
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
              <option value="少年">少年</option>
              <option value="少女">少女</option>
              <option value="青年">青年</option>
              <option value="兒童">兒童</option>
              <option value="全部">成人</option>
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
              <option value="連載中">連載</option>
              <option value="已完結">完結</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="year" className="font-medium text-gray-700">
              年份
            </label>
            <input
              name="year"
              id="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="年份"
              min={1900}
              max={new Date().getFullYear()}
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
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
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
              <option value="J">J</option>
              <option value="K">K</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="N">N</option>
              <option value="O">O</option>
              <option value="P">P</option>
              <option value="Q">Q</option>
              <option value="R">R</option>
              <option value="S">S</option>
              <option value="T">T</option>
              <option value="U">U</option>
              <option value="V">V</option>
              <option value="W">W</option>
              <option value="X">X</option>
              <option value="Y">Y</option>
              <option value="Z">Z</option>
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
