import CompleteGenerator from '../components/CompleteGenerator';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-400 to-white py-24 overflow-hidden">
        {/* 简化的背景装饰 */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* 标题 */}
            <div className="inline-block mb-4">
              <span className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-lg border border-white/30">
                ✨ AI 驱动的内容创作
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              让内容创作
              <span className="block mt-2">
                更智能、更高效
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-3xl mx-auto leading-relaxed">
              基于 Agentic 工作流的智能助手，为小红书、抖音、微博、知乎量身定制高质量内容
            </p>

            {/* CTA 按钮 - 最终版：开始创作（单行、无箭头、无下划线、高级样式） */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#generator"
                className="px-8 py-4 bg-white text-blue-700 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 no-underline"
                style={{
                  boxShadow: '0 8px 30px rgba(59, 130, 246, 0.25)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)'
                }}
              >
                开始创作
              </a>
              <button className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-full font-semibold shadow-lg hover:bg-blue-500/30 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border border-white/30">
                查看演示
              </button>
            </div>

            {/* 数据指标 */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                  4+
                </div>
                <div className="text-sm text-blue-100">支持平台</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                  20+
                </div>
                <div className="text-sm text-blue-100">语气风格</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                  3x
                </div>
                <div className="text-sm text-blue-100">效率提升</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                  5s
                </div>
                <div className="text-sm text-blue-100">快速生成</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容生成区域 */}
      <section id="generator" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
    
          </div>

          {/* 完整生成器组件 */}
          <div className="max-w-5xl mx-auto">
            <CompleteGenerator />
          </div>
        </div>
      </section>

      {/* 功能特性展示 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium rounded-full">
              核心功能
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              为什么选择我们
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专业的 AI 技术，简单的操作体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 特性卡片 1 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">多平台智能适配</h3>
              <p className="text-gray-600 leading-relaxed">
                针对小红书、抖音、微博、知乎等平台特性，自动调整内容风格、长度和格式
              </p>
            </div>

            {/* 特性卡片 2 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Agentic 智能工作流</h3>
              <p className="text-gray-600 leading-relaxed">
                多阶段协同生成，从需求分析到最终润色，确保每一步都精益求精
              </p>
            </div>

            {/* 特性卡片 3 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">人机协同优化</h3>
              <p className="text-gray-600 leading-relaxed">
                支持对话式优化，AI 理解你的反馈，持续改进直到完美
              </p>
            </div>

            {/* 特性卡片 4 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">丰富的配置选项</h3>
              <p className="text-gray-600 leading-relaxed">
                20+ 种语气风格，支持自定义关键词、受众定位等高级设置
              </p>
            </div>

            {/* 特性卡片 5 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">URL 智能分析</h3>
              <p className="text-gray-600 leading-relaxed">
                输入文章链接，AI 自动提取核心内容并生成营销策略
              </p>
            </div>

            {/* 特性卡片 6 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">极速批量生成</h3>
              <p className="text-gray-600 leading-relaxed">
                一次生成多个版本，智能评分排序，快速选出最佳方案
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}