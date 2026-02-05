import DualColumnGenerator from '../components/DualColumnGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 极简专业风格 */}
      <section className="relative bg-gradient-to-b from-gray-50/50 to-white pt-20 pb-16">
        {/* 极简背景装饰 - 不喧宾夺主 */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 主标题 - 渐变文字 */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI Agent 驱动的
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              社交媒体内容自动生成平台
            </span>
          </h1>

          {/* 副标题 - 浅灰强调 Agentic */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            一句输入，AI 多阶段协同生成高质量内容
            <br />
            <span className="text-gray-500">基于 Agentic Workflow 的智能内容创作</span>
          </p>

          {/* CTA 按钮组 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#generator"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded hover:shadow-lg hover:scale-105 transition-all"
            >
              开始体验
            </a>
            <a 
              href="#workflow"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-gray-700 font-medium border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              查看工作流
            </a>
          </div>
        </div>
      </section>

      {/* 核心工作区 - 左右双栏 */}
      <section id="generator" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DualColumnGenerator />
        </div>
      </section>
    </div>
  );
}