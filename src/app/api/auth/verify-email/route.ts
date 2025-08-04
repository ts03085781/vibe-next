import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // 取得驗證 token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "缺少驗證 token" }, { status: 400 });
    }

    // 查找用戶
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "驗證 token 無效或已過期" },
        { status: 400 }
      );
    }

    // 檢查是否已過期
    if (user.emailVerificationExpires < new Date()) {
      // 刪除過期的未驗證用戶
      await User.findByIdAndDelete(user._id);

      return NextResponse.json(
        {
          success: false,
          error: "驗證連結已過期，請重新註冊",
          tokenExpired: true,
        },
        { status: 400 }
      );
    }

    // 更新用戶驗證狀態
    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      updatedDate: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "電子郵件驗證成功！",
    });
  } catch (error) {
    console.error("郵件驗證失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}

// 重新發送驗證郵件
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "缺少電子郵件地址" }, { status: 400 });
    }

    // 查找用戶
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "找不到該電子郵件地址的用戶" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "該電子郵件已經驗證過了" },
        { status: 400 }
      );
    }

    // 檢查是否已過期，如果過期則刪除用戶
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      await User.findByIdAndDelete(user._id);
      return NextResponse.json(
        { success: false, error: "驗證連結已過期，請重新註冊" },
        { status: 400 }
      );
    }

    // 生成新的驗證 token
    const crypto = await import("crypto");
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 更新用戶的驗證 token
    await User.findByIdAndUpdate(user._id, {
      emailVerificationToken,
      emailVerificationExpires,
      updatedDate: new Date(),
    });

    // 重新發送驗證郵件
    const { sendVerificationEmail } = await import("@/utils/email");
    await sendVerificationEmail(user.email, emailVerificationToken, user.nickname);

    return NextResponse.json({
      success: true,
      message: "驗證郵件已重新發送",
    });
  } catch (error) {
    console.error("重新發送驗證郵件失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
