# AI小說坊

AI小說坊是一個現代化的短篇小說/漫畫閱讀與管理平台，支援漫畫/小說上傳、分類、閱讀、語音朗讀、PWA 安裝等功能。前端採用 Next.js + React + Tailwind CSS，後端串接 Node.js 與 MongoDB Atlas，並可整合 ChatGPT API 生成內容。

---

## 技術棧

- **前端**：Next.js 13+ (App Router)、React 18、Tailwind CSS
- **後端 API**：Next.js API Route (Node.js)
- **資料庫**：MongoDB Atlas (雲端)
- **ORM**：Mongoose
- **圖片儲存**：Cloudinary（僅存 URL 於 DB）
- **語音朗讀**：Web Speech API (SpeechSynthesis)
- **其他**：TypeScript、ESLint、Prettier

---

## 主要功能

- 📚 首頁漫畫/小說列表（支援篩選、排序、分頁）
- 🔍 進階搜尋與分類
- 🖼️ 圖片上傳（Cloudinary 圖床）
- 📝 管理員後台（新增/編輯漫畫/小說/章節）
- 📖 閱讀頁（支援章節切換、語音朗讀）
- 🗣️ 一鍵語音朗讀章節內容
- 🗂️ MongoDB Atlas 雲端資料庫
- 🛡️ Schema 驗證與型別安全

---

## 專案結構

```
vibe-next/
├── public/                # 靜態資源（logo、manifest、icon等）
├── src/
│   ├── app/               # Next.js App Router 入口與頁面
│   │   ├── page.tsx       # 首頁
│   │   ├── admin/         # 管理員後台
│   │   ├── read/          # 閱讀頁
│   │   ├── api/           # API Route
│   ├── components/        # React UI 元件
│   ├── models/            # Mongoose Schema/Model
│   ├── lib/               # 共用函式庫（如 dbConnect）
│   ├── utils/             # 工具函式
│   ├── constants/         # 篩選/排序選項等常數
│   ├── mocks/             # mock 資料
├── .env.local             # 環境變數（MongoDB 連線字串等）
├── next.config.js         # Next.js 設定
├── tailwind.config.js     # Tailwind 設定
├── package.json
└── README.md
```

---

## 快速開始

1. **安裝Node.js**
   Node version: 23 up

2. **安裝依賴**

   ```bash
   npm install
   ```

3. **設定環境變數**
   - 複製 `.env.local.example` 為 `.env.local`
   - 設定 `MONGODB_URI` 為你的 MongoDB Atlas 連線字串（建議指定資料庫名稱）

4. **啟動開發伺服器**

   ```bash
   npm run dev
   ```

   預設在 [http://localhost:3000](http://localhost:3000) 開啟

---

## 主要環境變數

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/vibe-next
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
# 其他 API 金鑰...
```

---

## 常見問題

- **Q: 為什麼查不到資料？**
  - 請確認 MongoDB URI 是否正確、資料庫名稱一致、Schema 型別正確。
- **Q: 圖片無法顯示？**
  - 請確認 Cloudinary URL 正確，且已在 `next.config.js` 加入白名單。
- **Q: 語音朗讀沒反應？**
  - 請確認瀏覽器支援 Web Speech API，且內容非空。

---

## 進階功能

- **語音朗讀**：章節頁面可一鍵朗讀內容，支援暫停/繼續/停止。
- **管理員後台**：可新增/編輯漫畫主題與章節，支援多選分類、圖片上傳等。

---

## 貢獻方式

1. Fork 本專案
2. 建立新分支 (`git checkout -b feature/your-feature`)
3. 提交你的修改 (`git commit -am 'Add new feature'`)
4. Push 到你的分支 (`git push origin feature/your-feature`)
5. 發送 Pull Request

---

## 聯絡方式

- 作者：你的名字/團隊
- Email：ts03085781@gmail.com
- [Issues](https://github.com/vibe-next/issues)

---

如需更多協助，請參考原始碼註解或提出 Issue！  
**歡迎一起打造最棒的 AI 小說/漫畫平台！**
