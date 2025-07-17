import mongoose from "mongoose";

// 從環境變數取得 MongoDB 連線字串，通常放在 .env.local 檔案
const MONGODB_URI = process.env.MONGODB_URI!;

// 如果沒有設定連線字串，直接丟出錯誤提醒開發者
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// 定義一個快取物件，避免伺服器端每次 hot reload 都重複建立連線
interface Cached {
  conn: typeof mongoose | null; // 已建立的 mongoose 連線實例
  promise: Promise<typeof mongoose> | null; // 連線中的 promise，避免重複連線
}

// 初始化快取物件
const cached: Cached = { conn: null, promise: null };

// 主要的連線函式，呼叫後會回傳 mongoose 連線實例
async function dbConnect() {
  // 如果已經有連線，直接回傳，不再重複連線
  if (cached.conn) {
    return cached.conn;
  }

  // 如果還沒有正在連線的 promise，建立一個新的連線 promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 關閉 mongoose 的命令緩衝，避免多餘的記憶體消耗
    };

    // 建立連線，並將 promise 存到快取
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    });
  }

  try {
    // 等待 promise 完成，並將連線結果存到快取
    cached.conn = await cached.promise;
  } catch (e) {
    // 如果連線失敗，重設 promise，並丟出錯誤
    cached.promise = null;
    throw e;
  }

  // 回傳已建立的 mongoose 連線實例
  return cached.conn;
}

// 匯出 dbConnect 供其他檔案使用
export default dbConnect;
