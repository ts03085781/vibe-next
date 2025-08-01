import React from "react";
import Image from "next/image";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-wrap md:flex-row md:justify-between gap-8">
          {/* 網站資訊 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="logo" width={36} height={36} />
              <span className="text-xl font-bold">VoiceToon</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              提供最新、最熱門的有聲短篇小說與漫畫內容，讓您隨時享受有聲閱讀的樂趣。
            </p>
            <div className="flex flex-col gap-4 items-center md:items-start">
              <a
                href="mailto:ts03085781@gmail.com"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-sm flex items-center gap-2">
                  <MdEmail />: ts03085781@gmail.com
                </span>
              </a>
              <a
                href="tel:0960081103"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-sm flex items-center gap-2">
                  <MdOutlinePhoneIphone />: 0960-081-103
                </span>
              </a>
              <a
                href="https://www.cake.me/s--7Ip1sbsZIlXtVtr7AJABzw--/ts03085781"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-sm flex items-center gap-2">
                  <FaAddressCard />: https://www.cake.me/s--7Ip1sbsZIlXtVtr7AJABzw--/ts03085781
                </span>
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-around gap-8 flex-grow">
            {/* 快速連結 */}
            <div>
              <h3 className="font-bold text-lg mb-4">快速連結</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    最新更新
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    排行榜
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    完結作品
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    漫畫家
                  </a>
                </li>
              </ul>
            </div>

            {/* 支援與幫助 */}
            <div>
              <h3 className="font-bold text-lg mb-4">支援與幫助</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    使用條款
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    隱私政策
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    意見回饋
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    聯絡我們
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 版權資訊 */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 VoiceToon. 保留所有權利.</p>
            <p className="mt-2 md:mt-0">本網站僅供學習與娛樂使用，所有內容版權歸原作者所有</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
