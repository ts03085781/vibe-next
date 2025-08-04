import nodemailer from "nodemailer";

// Gmail SMTP 設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // 應用程式密碼
  },
});

// 驗證郵件發送函數
export const sendVerificationEmail = async (
  to: string,
  verificationToken: string,
  username: string
) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: "VoiceToon - 電子郵件驗證",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VoiceToon</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">歡迎加入我們的閱讀社群！</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">親愛的 ${username}，</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            感謝您註冊 VoiceToon！為了確保您的帳戶安全，請點擊下方的按鈕來驗證您的電子郵件地址。
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold;">
              驗證電子郵件
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            如果按鈕無法點擊，請複製以下連結到瀏覽器：
          </p>
          
          <p style="color: #667eea; word-break: break-all; font-size: 14px;">
            ${verificationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            此郵件由 VoiceToon 系統自動發送，請勿回覆。<br>
            如果您沒有註冊 VoiceToon，請忽略此郵件。
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("驗證郵件發送成功:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("驗證郵件發送失敗:", error);
    return { success: false, error: error instanceof Error ? error.message : "未知錯誤" };
  }
};

// 密碼重設郵件發送函數
export const sendPasswordResetEmail = async (to: string, resetToken: string, username: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: "VoiceToon - 密碼重設",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">VoiceToon</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">密碼重設請求</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">親愛的 ${username}，</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            我們收到了您的密碼重設請求。請點擊下方的按鈕來重設您的密碼。
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block; 
                      font-weight: bold;">
              重設密碼
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            如果按鈕無法點擊，請複製以下連結到瀏覽器：
          </p>
          
          <p style="color: #667eea; word-break: break-all; font-size: 14px;">
            ${resetUrl}
          </p>
          
          <p style="color: #ff6b6b; font-size: 14px; margin-top: 25px;">
            ⚠️ 此連結將在 1 小時後失效。如果您沒有請求重設密碼，請忽略此郵件。
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            此郵件由 VoiceToon 系統自動發送，請勿回覆。
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("密碼重設郵件發送成功:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("密碼重設郵件發送失敗:", error);
    return { success: false, error: error instanceof Error ? error.message : "未知錯誤" };
  }
};
