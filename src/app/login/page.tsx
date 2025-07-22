"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError(data.error || "登入失敗");
      }
    } catch (e) {
      setError("API 請求失敗");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">會員登入</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="帳號 (或留空用信箱登入)"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="信箱 (或留空用帳號登入)"
          className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 mb-2"
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
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all duration-150"
          disabled={loading}
        >
          {loading ? "登入中..." : "登入"}
        </button>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <div className="text-center text-gray-400 mt-2">
          還沒有帳號？{" "}
          <a href="/register" className="text-orange-600 hover:underline font-bold">
            註冊
          </a>
        </div>
      </form>
    </div>
  );
}
