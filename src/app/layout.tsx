import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 社交媒体内容生成器 · Agentic 智能创作平台",
  description:
    "基于 Agentic 工作流的 AI 内容生成平台，支持小红书、抖音、微博、知乎等多平台，一键生成高质量社交媒体内容。",
  keywords:
    "AI内容生成,Agentic,社交媒体,内容创作,小红书,抖音,微博,知乎",
  authors: [{ name: "AI Creator Team" }],
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>

        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          跳转到主要内容
        </a>

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                  
                </div>
                <div className="leading-tight">
                  <div className="text-lg font-bold text-gray-900">
                    AI Creator
                  </div>
                  <div className="hidden sm:block text-xs text-gray-500">
                    Agentic Content Platform
                  </div>
                </div>
              </a>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                <a href="#features" className="nav-link">功能</a>
                <a href="#generator" className="nav-link">开始创作</a>
                <a href="#pricing" className="nav-link">定价</a>

                <div className="ml-4">
                  <a
                    href="#generator"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600
                               text-white rounded-lg shadow-sm hover:shadow-md transition font-medium text-sm"
                  >
                    免费试用
                  </a>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="打开菜单"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main
          id="main-content"
          className="pt-16 min-h-screen bg-gradient-to-b from-white to-gray-50"
        >
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto px-6 py-16">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    
                  </div>
                  <span className="text-xl font-semibold text-white">
                    AI 内容生成器
                  </span>
                </div>
                <p className="text-gray-400 max-w-md">
                  一个基于 Agentic 工作流的智能内容创作平台，
                  帮助创作者和品牌高效生成高质量社交媒体内容。
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">产品</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="footer-link">功能特性</a></li>
                  <li><a href="#generator" className="footer-link">开始创作</a></li>
                  <li><a href="#workflow" className="footer-link">工作流程</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4">联系</h4>
                <ul className="space-y-2">
                  <li>Email：contact@example.com</li>
                  <li>
                    GitHub：
                    <a href="https://github.com/yourusername" className="footer-link ml-1">
                      yourusername
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} AI Creator. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
