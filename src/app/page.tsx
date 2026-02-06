import CompleteGenerator from '../components/CompleteGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= Hero（视觉特例，允许渐变） ================= */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-5 py-2 bg-white/20 text-white text-sm rounded-full mb-6">
            ✨ Agentic AI 内容生成平台
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
            让内容创作
            <span className="block">更智能 · 更高效</span>
          </h1>

          <p className="text-xl text-blue-50 max-w-3xl mx-auto mb-14">
            基于 Agentic 工作流的 AI 助手，
            为主流内容平台生成高质量创作方案
          </p>

          <a
            href="#generator"
            className="inline-block px-10 py-4 bg-white text-blue-700 rounded-full font-semibold shadow-xl
                       hover:shadow-2xl hover:-translate-y-1 transition"
          >
            开始创作
          </a>
        </div>
      </section>

      {/* ================= Generator（L2：区块背景） ================= */}
      <section
        id="generator"
        className="py-28 bg-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* 区块标题 */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full">
              🤖 AI 工作区
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
              内容生成工作台
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              输入你的需求，AI 将自动规划并执行内容生成流程
            </p>
          </div>

          {/* ================= L3：核心卡片（关键） ================= */}
          <div className="max-w-5xl mx-auto">
            <div
              className="
                bg-white
                rounded-2xl
                shadow-[0_10px_40px_rgba(15,23,42,0.08)]
                p-10
              "
            >
              <CompleteGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* ================= Features（L2：纯白区） ================= */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">
            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full">
              核心能力
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
              为什么选择我们
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              用 AI 重构内容创作流程
            </p>
          </div>

          {/* Feature 卡片区：你原来的结构直接放这里 */}
        </div>
      </section>
    </div>
  );
}
