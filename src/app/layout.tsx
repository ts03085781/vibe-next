import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppInit from "@/components/AppInit";

export const metadata: Metadata = {
  title: "VoiceToon - AI小說有聲平台 | Voice Toon 最佳選擇",
  description:
    "VoiceToon 一個AI小說有聲平台，提供高品質的AI生成小說內容。Voice Toon 的最佳選擇，讓您享受沉浸式有聲閱讀體驗。",
  keywords:
    "VoiceToon, voice toon, AI小說, 有聲小說, 語音小說, AI生成, 有聲平台, 小說平台, 語音閱讀, 數位閱讀",
  authors: [{ name: "VoiceToon Team" }],
  creator: "VoiceToon",
  publisher: "VoiceToon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://voicetoon.vercel.app",
    title: "VoiceToon - AI小說有聲平台 | Voice Toon 最佳選擇",
    description:
      "VoiceToon 一個AI小說有聲平台，提供高品質的AI生成小說內容。Voice Toon 的最佳選擇，讓您享受沉浸式有聲閱讀體驗。",
    siteName: "VoiceToon",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "VoiceToon - AI小說有聲平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceToon - AI小說有聲平台 | Voice Toon 最佳選擇",
    description:
      "VoiceToon 一個AI小說有聲平台，提供高品質的AI生成小說內容。Voice Toon 的最佳選擇，讓您享受沉浸式有聲閱讀體驗。",
    images: ["/images/logo.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code", // 請替換為您的Google Search Console驗證碼
  },
  alternates: {
    canonical: "https://voicetoon.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        {/* google search console 驗證碼 */}
        <meta
          name="google-site-verification"
          content="PGh9s2ZEvtKLU5HHyUey90dtFUI46BqmH3gBc-_SBCk"
        />
        {/* favicon標籤 用於顯示在 google 搜尋結果的網站圖示*/}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className="antialiased">
        <AppInit />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
