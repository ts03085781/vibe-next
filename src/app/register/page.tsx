"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { apiPost } from "@/utils/api";

interface FormData {
  username: string;
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  username: "",
  email: "",
  password: "",
  nickname: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useUserStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 密碼重複驗證
    if (form.password !== form.confirmPassword) {
      setError("輸入的密碼不一致，請再次確認密碼");
      setLoading(false);
      return;
    }

    try {
      const res = await apiPost("/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      });
      const data = await res.json();
      if (data.success) {
        login(data.data.accessToken, data.data.user);
        alert("註冊成功，將跳轉至首頁");
        router.push("/");
      } else {
        setError(data.error || "註冊失敗");
      }
    } catch (err) {
      console.error("註冊失敗:", err);
      setError("API 請求失敗");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">會員註冊</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="帳號"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
          required
        />
        <input
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="暱稱"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="信箱"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="密碼"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="再次輸入密碼"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all duration-150"
          disabled={loading}
        >
          {loading ? "註冊中..." : "註冊"}
        </button>
        {error && <div className="text-red-400 text-center font-bold">{error}</div>}
        <div className="text-center text-gray-400 mt-2">
          已有帳號？{" "}
          <a href="/login" className="text-orange-600 hover:underline font-bold">
            登入
          </a>
        </div>
      </form>
    </div>
  );
}
