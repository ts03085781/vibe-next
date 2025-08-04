import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/utils/email";
import crypto from "crypto";

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
      // 為了安全，即使找不到用戶也回傳成功
      return NextResponse.json({
        success: true,
        message: "如果該電子郵件地址存在，重設密碼連結已發送",
      });
    }

    // 生成密碼重設 Token
    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1小時後過期

    // 更新用戶的密碼重設 Token
    await User.findByIdAndUpdate(user._id, {
      passwordResetToken,
      passwordResetExpires,
      updatedDate: new Date(),
    });

    // 發送密碼重設郵件
    try {
      await sendPasswordResetEmail(user.email, passwordResetToken, user.nickname);
    } catch (emailError) {
      console.error("發送密碼重設郵件失敗:", emailError);
      return NextResponse.json(
        { success: false, error: "郵件發送失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "密碼重設連結已發送到您的電子郵件",
    });
  } catch (error) {
    console.error("忘記密碼處理失敗:", error);
    return NextResponse.json({ success: false, error: "伺服器錯誤" }, { status: 500 });
  }
}
