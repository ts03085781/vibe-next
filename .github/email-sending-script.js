#! /usr/bin/env node

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.API_KEY_FOR_VIBE_NEXT);

const msg = {
  to: "ts03085781@gmail.com",
  from: "ts03085781@gmail.com",
  subject: `🚨 github ${process.env.GITHUB_REPOSITORY} 專案中的 Main 分支有新的 push！`,
  // text: `
  //   有人對 Main 分支做了 push。

  //   專案名稱：${process.env.GITHUB_REPOSITORY}
  //   提交者：${process.env.GITHUB_ACTOR}
  //   提交時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
  //   提交 SHA：${process.env.GITHUB_SHA}
  //   查看變更：https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}
  // `,
  html: `
    <h2>🚨 GitHub 專案更新通知</h2>
    <p>有人對 Main 分支做了 push。</p>
    <ul>
      <li><strong>專案名稱：</strong>${process.env.GITHUB_REPOSITORY}</li>
      <li><strong>提交者：</strong>${process.env.GITHUB_ACTOR}</li>
      <li><strong>提交時間：</strong>${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}</li>
      <li><strong>提交 SHA：</strong>${process.env.GITHUB_SHA}</li>
    </ul>
    <p><a href="https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}">點擊查看變更內容</a></p>
  `,
};

sgMail
  .send(msg)
  .then(() => console.log("郵件發送成功"))
  .catch(error => console.error("郵件發送失敗：", error.toString()));
