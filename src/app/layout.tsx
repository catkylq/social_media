import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI社交媒体内容生成器",
  description: "基于 Agentic 工作流的智能内容生成平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {/* 导航栏 */}
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {/* <span className="text-white font-bold text-lg">AI</span> */}
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {/* 内容生成器 */}
                </span>
              </div>

              {/* 导航链接 */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
                  功能特性
                </a>
                <a href="#workflow" className="text-gray-600 hover:text-gray-900 transition">
                  工作流程
                </a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition">
                  关于我们
                </a>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition">
                  开始使用
                </button>
              </div>

              {/* 移动端菜单按钮 */}
              <button className="md:hidden text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>

        {/* 页脚 */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* 品牌信息 */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">首页</a></li>
                  <li><a href="#features" className="hover:text-white transition">功能特性</a></li>
                  <li><a href="#workflow" className="hover:text-white transition">工作流程</a></li>
                  <li><a href="#" className="hover:text-white transition">使用文档</a></li>
                </ul>
              </div>

              {/* 联系方式 */}
              <div>
                <h3 className="font-semibold mb-4">联系我们</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>邮箱：contact@example.com</li>
                  <li>GitHub：github.com/yourusername</li>
                  <li>Twitter：@yourhandle</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 AI 社交媒体内容生成器. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}