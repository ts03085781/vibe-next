const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

// 連接資料庫
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("資料庫連接成功");
  } catch (error) {
    console.error("資料庫連接失敗:", error);
    process.exit(1);
  }
}

// 清理過期未驗證用戶
async function cleanupExpiredUsers() {
  try {
    const User = mongoose.model(
      "User",
      new mongoose.Schema({
        emailVerified: Boolean,
        emailVerificationExpires: Date,
        createdDate: Date,
      })
    );

    // 查找所有過期且未驗證的用戶
    const expiredUsers = await User.find({
      emailVerified: false,
      emailVerificationExpires: { $lt: new Date() },
    });

    console.log(`找到 ${expiredUsers.length} 個過期未驗證用戶`);

    if (expiredUsers.length > 0) {
      // 刪除過期的未驗證用戶
      const result = await User.deleteMany({
        emailVerified: false,
        emailVerificationExpires: { $lt: new Date() },
      });

      console.log(`已清理 ${result.deletedCount} 個過期未驗證用戶`);
    }

    // 統計資訊
    const totalUnverifiedCount = await User.countDocuments({
      emailVerified: false,
    });

    const totalUsersCount = await User.countDocuments();

    console.log(`統計資訊:`);
    console.log(`- 總用戶數: ${totalUsersCount}`);
    console.log(`- 未驗證用戶數: ${totalUnverifiedCount}`);
    console.log(`- 已驗證用戶數: ${totalUsersCount - totalUnverifiedCount}`);
  } catch (error) {
    console.error("清理過期用戶失敗:", error);
  } finally {
    await mongoose.disconnect();
    console.log("資料庫連接已關閉");
  }
}

// 執行清理
async function main() {
  await connectDB();
  await cleanupExpiredUsers();
}

// 如果直接執行此腳本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { cleanupExpiredUsers };
