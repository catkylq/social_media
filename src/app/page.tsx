import CompleteGenerator from '../components/CompleteGenerator';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* 标题 */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              用 AI 创造
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}完美内容
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              基于先进的 Agentic 工作流，智能分析、自动生成、人机协同优化。
              让社交媒体内容创作变得简单、高效、专业。
            </p>

            {/* 特性标签 */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
                🚀 多平台支持
              </span>
              <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
                🎯 精准语气控制
              </span>
              <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
                🤖 智能工作流
              </span>
              <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
                💬 人机协同
              </span>
            </div>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#generator"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
              >
                立即开始创作 →
              </a>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold shadow-md hover:shadow-lg transition">
                查看示例
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容生成区域 */}
      <section id="generator" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              开始创作您的内容
            </h2>
            <p className="text-gray-600">
              选择输入方式，配置生成选项，让 AI 为您创造完美内容
            </p>
          </div>

          {/* 完整生成器组件 */}
          <div className="max-w-4xl mx-auto">
            <CompleteGenerator />
          </div>
        </div>
      </section>

      {/* 功能特性展示 */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              强大的功能特性
            </h2>
            <p className="text-gray-600">
              一站式解决社交媒体内容创作的所有需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特性卡片 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">多平台优化</h3>
              <p className="text-gray-600">
                针对小红书、抖音、微博、知乎等平台特性，自动优化内容格式和风格，每个平台都有专属的内容策略
              </p>
            </div>

            {/* 特性卡片 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">智能工作流</h3>
              <p className="text-gray-600">
                采用 Agentic 架构，从需求分析到内容生成，多阶段协同工作，确保高质量输出
              </p>
            </div>

            {/* 特性卡片 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">人机协同</h3>
              <p className="text-gray-600">
                支持对话式优化，根据您的反馈持续改进内容，直到达到完美效果
              </p>
            </div>

            {/* 特性卡片 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高级配置</h3>
              <p className="text-gray-600">
                20+种语气可选，支持自定义关键词、目标受众、创意度等高级选项
              </p>
            </div>

            {/* 特性卡片 5 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">URL智能提取</h3>
              <p className="text-gray-600">
                输入文章链接，AI自动提取核心内容并生成精准推广文案
              </p>
            </div>

            {/* 特性卡片 6 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">极速生成</h3>
              <p className="text-gray-600">
                一次生成多个版本，批量导出，大幅提升内容创作效率
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}