import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "AI 社交媒体内容生成器 · Agentic 智能创作平台",
  description: "基于 Agentic 工作流的 AI 内容生成平台，支持小红书、抖音、微博、知乎等多平台，一键生成高质量社交媒体内容。",
  keywords: "AI内容生成,Agentic,社交媒体,内容创作,小红书,抖音,微博,知乎",
  authors: [{ name: "AI Creator Team" }],
  themeColor: "#7c3aed",
  icons: {
    icon: '/favicon.svg',      // 新增此行
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={notoSans.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          跳转到主要内容
        </a>

        {/* 导航：透明玻璃，融入紫色背景 */}
        <nav className="fixed top-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-sm group-hover:bg-white/30 transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-base font-bold text-white">AI Creator</div>
                  <div className="hidden sm:block text-xs text-white/50">Agentic Content Platform</div>
                </div>
              </a>

              <div className="hidden md:flex items-center gap-1">
                {/* 只保留“历史”链接 */}
                <a href="/history" className="nav-link">历史</a>
              </div>

              <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition" aria-label="打开菜单">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <main id="main-content" className="pt-16 min-h-screen">
          {children}
        </main>

        <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 text-white/50">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-base font-semibold text-white">AI 内容生成器</span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  一个基于 Agentic 工作流的智能内容创作平台，帮助创作者和品牌高效生成高质量社交媒体内容。
                </p>
              </div>
              <div>
                <h4 className="text-white/80 font-semibold mb-4 text-sm">产品</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="footer-link hover:text-white/70 transition-colors">功能特性</a></li>
                  <li><a href="#generator" className="footer-link hover:text-white/70 transition-colors">开始创作</a></li>
                  <li><a href="#workflow" className="footer-link hover:text-white/70 transition-colors">工作流程</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/80 font-semibold mb-4 text-sm">联系</h4>
                <ul className="space-y-2 text-sm">
                  <li>Email：contact@example.com</li>
                  <li>GitHub：<a href="#" className="hover:text-white/70 transition-colors">yourusername</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/30">
              © {new Date().getFullYear()} AI Creator. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}