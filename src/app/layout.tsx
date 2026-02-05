import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 社交媒体内容生成器 - 智能创作助手",
  description: "基于 Agentic 工作流的智能内容生成平台，支持小红书、抖音、微博、知乎等多平台，20+种语气可选，一键生成高质量内容",
  keywords: "AI内容生成,社交媒体,小红书,抖音,微博,知乎,内容创作,智能写作",
  authors: [{ name: "Your Name" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {/* 跳过导航链接（无障碍） */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          跳转到主要内容
        </a>

        {/* 导航栏 */}
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm" role="navigation" aria-label="主导航">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow" aria-hidden="true">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Creator
                </span>
              </a>

              {/* 导航链接 */}
              <div className="hidden md:flex items-center space-x-1">
                <a href="#features" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition font-medium text-sm">
                  功能
                </a>
                <a href="#generator" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition font-medium text-sm">
                  开始创作
                </a>
                <a href="#pricing" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition font-medium text-sm">
                  定价
                </a>
                <div className="ml-4 pl-4 border-l border-gray-200">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm">
                    免费试用
                  </button>
                </div>
              </div>

              {/* 移动端菜单按钮 */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                aria-label="打开菜单"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main id="main-content" className="pt-16 min-h-screen">
          {children}
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-900 text-white py-12" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* 品牌信息 */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <span className="text-xl font-bold">AI 内容生成器</span>
                </div>
                <p className="text-gray-400 mb-4">
                  基于先进的 Agentic 工作流，帮助您快速创建高质量的社交媒体内容。
                  支持多平台、多语气，让内容创作变得简单高效。
                </p>
              </div>

              {/* 快速链接 */}
              <div>
                <h3 className="font-semibold mb-4">快速链接</h3>
                <nav aria-label="页脚导航">
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition focus:outline-none focus:underline">首页</a></li>
                    <li><a href="#features" className="hover:text-white transition focus:outline-none focus:underline">功能特性</a></li>
                    <li><a href="#workflow" className="hover:text-white transition focus:outline-none focus:underline">工作流程</a></li>
                    <li><a href="#" className="hover:text-white transition focus:outline-none focus:underline">使用文档</a></li>
                  </ul>
                </nav>
              </div>

              {/* 联系方式 */}
              <div>
                <h3 className="font-semibold mb-4">联系我们</h3>
                <address className="not-italic">
                  <ul className="space-y-2 text-gray-400">
                    <li>邮箱：<a href="mailto:contact@example.com" className="hover:text-white transition">contact@example.com</a></li>
                    <li>GitHub：<a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">github.com/yourusername</a></li>
                    <li>Twitter：<a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">@yourhandle</a></li>
                  </ul>
                </address>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} AI 社交媒体内容生成器. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}