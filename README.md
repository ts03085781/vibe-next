# VoiceToon

VoiceToon 是一個革命性的 AI 驅動有聲小說平台，致力於為用戶提供沉浸式的閱讀體驗。平台結合了現代化的網頁技術與 AI 內容生成能力，讓用戶不僅能閱讀精彩的小說內容，還能享受語音朗讀功能，打造全新的數位閱讀體驗。

在當今快節奏的數位時代，VoiceToon 重新定義了閱讀的意義。我們相信，閱讀不應該只是視覺的享受，更應該是全方位的感官體驗。透過先進的 AI 技術，我們能夠自動生成原創的小說內容，為創作者提供無限的靈感來源；同時，運用 Web Speech API 技術，我們為每一段文字注入了生命，讓故事能夠被「聽見」，讓閱讀變得更加生動有趣。

VoiceToon 不僅是一個閱讀平台，更是一個創作的搖籃。我們為作者提供了完整的創作工具，從作品上傳、章節管理到社群互動，每一個環節都經過精心設計。讀者可以在這裡發現新世界，作者可以在這裡分享故事，而 AI 則在這裡扮演著靈感夥伴的角色，共同創造出屬於這個時代的文學作品。

無論你是忙碌的上班族想要在通勤時享受有聲閱讀，還是創作者尋找靈感與發表平台，VoiceToon 都能為你提供最佳的數位閱讀體驗。讓我們一起探索文字與聲音的完美結合，開啟閱讀的新紀元。

## 🎯 品牌特色

- **AI 內容生成**：整合 ChatGPT API，自動生成原創小說內容
- **語音朗讀技術**：運用 Web Speech API，提供自然流暢的語音朗讀
- **現代化設計**：採用響應式設計，支援 PWA 安裝
- **社群互動**：支援留言、評分、收藏等社交功能

---

## 🛠️ 技術架構

### 前端技術棧

- **Next.js 15.4.1**：採用 App Router 架構，提供 SSR/SSG 優化
- **React 19.1.0**：使用最新的 React 版本，支援並發特性
- **TypeScript 5**：完整的型別安全，提升開發效率
- **Tailwind CSS 4**：現代化的 CSS 框架，快速構建響應式 UI
- **Zustand 5.0.6**：輕量級狀態管理

### 後端技術棧

- **Next.js API Routes**：無需額外後端服務器，全棧開發
- **MongoDB Atlas**：雲端 NoSQL 資料庫，高可用性
- **Mongoose 8.16.3**：MongoDB ODM，提供 Schema 驗證
- **JWT + bcryptjs**：安全的身份驗證與密碼加密

### 第三方服務整合

- **Cloudinary**：雲端圖片儲存與 CDN 服務
- **Web Speech API**：瀏覽器原生語音合成技術
- **React Icons**：豐富的圖標庫

---

## 🚀 核心功能

### 內容管理系統

- **作品上傳**：支援封面圖片上傳、分類標籤、內容描述
- **章節管理**：多章節結構，支援章節編輯與排序
- **分類系統**：多維度分類（類型、受眾、年份、狀態）
- **搜尋功能**：全文搜尋與進階篩選

### 用戶體驗功能

- **語音朗讀**：一鍵朗讀章節內容，支援暫停/繼續/停止
- **收藏系統**：個人收藏庫，快速存取喜愛作品
- **評分系統**：0-10 分評分機制，幫助用戶發現優質內容
- **留言互動**：作品留言功能，支援按讚互動

### 創作平台

- **創作專區**：作者專屬創作空間
- **作品管理**：個人作品編輯、刪除、更新
- **章節編輯**：線上章節編輯器
- **權限控制**：作品所有權驗證

### 用戶系統

- **註冊/登入**：JWT 身份驗證
- **個人資料**：暱稱、用戶名管理
- **收藏管理**：個人收藏作品管理
- **創作歷史**：個人創作作品追蹤

---

## 📊 資料模型設計

### 核心實體

- **User**：用戶資料與身份驗證
- **Manga**：作品主體，包含標題、描述、封面、評分等
- **Chapter**：章節內容，支援文字與影片格式
- **Comment**：留言系統，支援按讚功能
- **Rating**：評分系統，確保每用戶每作品唯一評分
- **Favorite**：收藏系統，用戶個人收藏列表

---

## 🎨 用戶介面設計

### 響應式設計

- **桌面版**：完整功能展示，多欄位佈局
- **平板版**：適中佈局，保持功能完整性
- **手機版**：單欄佈局，觸控友善設計

### 設計系統

- **色彩方案**：深色主題，專業視覺效果
- **字體系統**：系統字體堆疊，確保跨平台一致性
- **組件庫**：可重用的 UI 組件
- **動畫效果**：流暢的過渡動畫

---

## 🏗️ 專案結構

```
vibe-next/
├── public/                # 靜態資源（logo、manifest、icon等）
├── src/
│   ├── app/               # Next.js App Router 入口與頁面
│   │   ├── page.tsx       # 首頁
│   │   ├── creation/      # 創作專區
│   │   ├── introduction/  # 作品介紹
│   │   ├── favorite/      # 收藏頁面
│   │   ├── api/           # API Route
│   ├── components/        # React UI 元件
│   ├── models/            # Mongoose Schema/Model
│   ├── lib/               # 共用函式庫
│   ├── utils/             # 工具函式
│   ├── constants/         # 篩選/排序選項等常數
│   ├── store/             # Zustand 狀態管理
│   ├── types/             # TypeScript 型別定義
├── .env.local             # 環境變數
├── next.config.ts         # Next.js 設定
└── package.json
```

---

## 🚀 快速開始

### 環境需求

- **Node.js**：版本 23 或以上
- **npm**：包管理器

### 安裝步驟

1. **安裝依賴**

   ```bash
   npm install
   ```

2. **設定環境變數**
   - 複製 `.env.local.example` 為 `.env.local`
   - 設定 `MONGODB_URI` 為你的 MongoDB Atlas 連線字串
   - 設定 `CLOUDINARY_URL` 為 Cloudinary 連線字串

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   預設在 [http://localhost:3000](http://localhost:3000) 開啟

### 主要環境變數

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/vibe-next
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=your-cron-secret-key  # 可選，用於保護 Cron Job
```

---

## 🔧 開發工具

### 開發環境

- **Turbopack**：快速的開發伺服器
- **ESLint + Prettier**：程式碼品質與格式化
- **TypeScript**：型別安全與開發體驗

### 部署與 DevOps

- **Vercel**：推薦部署平台
- **MongoDB Atlas**：雲端資料庫服務
- **Cloudinary**：圖片 CDN 服務

---

## 🎯 技術亮點

### 1. 現代化架構

- 採用 Next.js 15 最新特性
- 使用 React 19 並發特性
- TypeScript 完整型別支援

### 2. 性能優化

- 圖片懶載入與優化
- 字體載入策略優化
- 資料庫索引優化
- 快取策略實作

### 3. 安全性

- JWT 身份驗證
- 密碼 bcrypt 加密
- 所有權驗證中間件
- 輸入驗證與清理

### 4. 可擴展性

- 模組化組件設計
- 可重用的 API 中間件
- 清晰的資料模型設計
- 完整的錯誤處理機制

---

## 🔮 未來發展方向

### 短期目標

- PWA 功能完善
- 更多語音選項
- 社群功能增強

### 長期願景

- AI 內容生成整合
- 多語言支援
- 行動應用開發
- 商業化功能

---

## 🤝 貢獻方式

1. Fork 本專案
2. 建立新分支 (`git checkout -b feature/your-feature`)
3. 提交你的修改 (`git commit -am 'Add new feature'`)
4. Push 到你的分支 (`git push origin feature/your-feature`)
5. 發送 Pull Request

---

## 📞 聯絡方式

- **Email**：ts03085781@gmail.com
- **Issues**：[GitHub Issues](https://github.com/vibe-next/issues)

---

VoiceToon 不僅是一個技術專案，更是一個致力於改變數位閱讀體驗的創新平台，結合了現代化技術與人性化設計，為用戶提供前所未有的閱讀體驗。

**歡迎一起打造最棒的 AI 小說/漫畫平台！**
