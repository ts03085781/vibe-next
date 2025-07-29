"use client";
import React, { useEffect, useState } from "react";
import { genreList, audienceList, statusList, alphaList } from "@/constants/filterConfig";
import { IManga } from "@/models/Manga";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import { apiGet, apiPost } from "@/utils/api";

type Form = {
  title: string;
  description: string;
  coverImage: string;
  rating: number;
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
  genre: [],
  audience: "少年",
  status: "連載",
  year: new Date().getFullYear(),
  alpha: "A",
  collectionsCount: 0,
  tag: "",
};

type FormChapter = {
  mangaId: string;
  chapterNumber: number;
  title: string;
  content: string;
};

const initialFormChapter = {
  mangaId: "",
  chapterNumber: 0,
  title: "",
  content: "",
};

export default function MangaAdminForm() {
  const [form, setForm] = useState<Form>(initialForm);
  const [formChapter, setFormChapter] = useState<FormChapter>(initialFormChapter);
  const [allMangas, setAllMangas] = useState<IManga[]>([]);

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
        [name]: ["rating", "year", "collectionsCount"].includes(name) ? Number(value) : value,
      }));
    }
  };

  // 處理表單提交
  const handleSubmitManga = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    const res = await apiPost("/api/mangas", payload);

    const data = await res.json();
    if (data.success) {
      alert("新增成功！");
      window.location.reload();
    } else {
      alert("新增失敗：" + (data.error || "未知錯誤"));
      window.location.reload();
    }
  };

  const handleChangeChapter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormChapter(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "mangaId") {
      const manga = allMangas.find(manga => manga._id === value);
      if (manga) {
        setFormChapter(prev => ({
          ...prev,
          chapterNumber: manga.totalChapters + 1,
        }));
      }
    }
  };

  const handleSubmitChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formChapter };
    const res = await apiPost("/api/chapters", payload);

    const data = await res.json();
    if (data.success) {
      alert("新增成功！");
      window.location.reload();
      setFormChapter(initialFormChapter);
    } else {
      alert("新增失敗：" + (data.error || "未知錯誤"));
      window.location.reload();
    }
  };

  useEffect(() => {
    // 獲取所有漫畫主題資料
    const fetchMangas = async () => {
      const res = await apiGet("/api/mangas");
      const data = await res.json();
      setAllMangas(data.data);
      setFormChapter(prev => ({
        ...prev,
        chapterNumber: data.data[0].totalChapters + 1,
        mangaId: data.data[0]._id,
      }));
    };
    fetchMangas();
  }, []);

  return (
    <div className="flex p-4 gap-4 bg-white">
      {/* 新增漫畫主題資料 */}
      <div className="w-1/2 min-h-screen flex">
        <form
          onSubmit={handleSubmitManga}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-extrabold text-blue-800 mb-4 text-center tracking-wide">
            新增主題基礎資料
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label htmlFor="title" className="font-medium text-gray-700">
                主題名稱<span className="text-red-500">*</span>
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
                className="border-1 border-gray-300 rounded-lg p-2 text-gray-700 min-h-[240px]"
              >
                {genreList.map((genre: { value: string; label: string }) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <CloudinaryUpload
                onUpload={url => setForm(prev => ({ ...prev, coverImage: url }))}
                currentImageUrl={form.coverImage}
                name="coverImage"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            送出
          </button>
        </form>
      </div>

      {/* 新增漫畫內容文章 */}
      <div className="w-1/2 min-h-screen flex">
        <form
          onSubmit={handleSubmitChapter}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-extrabold text-blue-800 mb-4 text-center tracking-wide">
            新增章節內容
          </h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="mangaId" className="font-medium text-gray-700">
              主題名稱<span className="text-red-500">*</span>
            </label>
            <select
              name="mangaId"
              id="mangaId"
              value={formChapter.mangaId}
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
              onChange={
                handleChangeChapter as unknown as React.ChangeEventHandler<HTMLSelectElement>
              }
            >
              {allMangas.map((manga: IManga) => (
                <option key={manga._id} label={manga.title} value={manga._id}>
                  {manga.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="chapterNumber" className="font-medium text-gray-700">
              本章節數<span className="text-red-500">*</span>
            </label>
            <input
              name="chapterNumber"
              id="chapterNumber"
              type="number"
              value={formChapter.chapterNumber}
              onChange={handleChangeChapter}
              placeholder="本篇章節數"
              required
              readOnly
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="font-medium text-gray-700">
              章節標題<span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              id="title"
              value={formChapter.title}
              onChange={handleChangeChapter}
              placeholder="本章標題"
              required
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="content" className="font-medium text-gray-700">
              章節內容<span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              id="content"
              value={formChapter.content}
              onChange={handleChangeChapter}
              placeholder="本章內容"
              className="border-1 border-gray-300 rounded-lg p-2 text-gray-700 min-h-[260px]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            送出
          </button>
        </form>
      </div>
    </div>
  );
}
