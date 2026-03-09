'use client';

import { useState } from 'react';
import FormPanel from '../components/FormPanel';
import ResultDisplay from '../components/ResultDisplay';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import { useToast } from '../components/ToastNotification';
import ErrorBoundary from '../components/ErrorBoundary';

type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface GeneratedContent {
  id: number;
  content: string;
  platform: string;
  createdAt: Date;
}

const PLATFORM_ICONS = [
  { label: '小红书', bg: 'bg-[#FF2442]', icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg> },
  { label: '抖音',  bg: 'bg-black',     icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
  { label: 'X',     bg: 'bg-black',     icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'LinkedIn', bg: 'bg-[#0A66C2]', icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: '微博',  bg: 'bg-[#E6162D]', icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9.827 17.763c-2.784.299-5.188-1.006-5.375-2.916-.188-1.911 1.914-3.701 4.7-3.999 2.784-.299 5.188 1.005 5.375 2.916.188 1.91-1.914 3.7-4.7 3.999zm6.531-7.952c-.346-.096-.583-.162-.402-.584.393-.987.433-1.837.007-2.443-.793-1.115-2.963-1.055-5.453-.012 0 0-.781.341-.581-.277.383-1.234.325-2.267-.272-2.864-1.375-1.375-5.032.052-8.167 3.187C-.82 9.09-1.054 12.033.977 14.064c1.941 1.941 5.621 3.132 9.583 3.132 5.64 0 9.381-3.274 9.381-5.877 0-1.57-1.328-2.453-3.583-3.508z"/></svg> },
  { label: 'YouTube', bg: 'bg-[#FF0000]', icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { label: '知乎',  bg: 'bg-[#0084FF]', icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5.721 0C2.562 0 0 2.562 0 5.721v12.558C0 21.438 2.562 24 5.721 24h12.558C21.438 24 24 21.438 24 18.279V5.721C24 2.562 21.438 0 18.279 0zm1.964 6.065l-.517 1.602H5.696l.93 1.007-1.28 3.953 1.607-1.09.493.755-2.22 1.507-.656-1.011.967-.657-1.24-1.37.17-.524h.001l.877-2.706-.773-.772h2.313zm3.521 8.553l-1.05.633L8.34 8.94l1.179-.085v-1.2h-2.25l.173-.538h2.077V5.641l1.438.09v1.386h2.101l-.18.538h-1.921v1.184l1.162.093-1.713 6.686zm6.113 2.215h-1.483l-1.71-1.283-1.697 1.283h-1.434l2.44-1.86-2.14-1.625h1.484l1.41 1.068 1.428-1.068h1.43l-2.126 1.607z"/></svg> },
];

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('小红书');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'url' | 'document'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [useAgenticMode, setUseAgenticMode] = useState(false);
  const [tone, setTone] = useState('专业 Professional');
  const [wordLimit, setWordLimit] = useState(300);
  const [generateCount, setGenerateCount] = useState(1);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);
  const [creativity, setCreativity] = useState<'保守' | '平衡' | '创新'>('平衡');
  const [targetAudience, setTargetAudience] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [mustExclude, setMustExclude] = useState('');

  const { showToast, ToastContainer } = useToast();

  const handleGenerate = async () => {
    if (inputMode !== 'text') { showToast('⚠️ 当前仅支持文字输入生成内容', 'warning'); return; }
    if (!textInput.trim()) { showToast('⚠️ 请先输入文字内容', 'warning'); return; }
    setIsLoading(true);
    setShowWorkflow(useAgenticMode);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText: textInput, platform, tone, wordLimit, generateCount, useHashtags, useEmojis, creativity, targetAudience, mustInclude, mustExclude }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults((data.results || []).map((item: any) => ({
        id: item.id, content: item.content, platform: item.platform, createdAt: new Date(item.createdAt),
      })));
      showToast('🎉 内容生成成功！', 'success');
    } catch (err: any) {
      showToast('❌ 内容生成失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
      setShowWorkflow(false);
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const handleAnalyzeURL = async () => {
    if (!urlInput) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsAnalyzing(false);
    showToast('🔍 URL 分析完成', 'success');
  };

  return (
    <ErrorBoundary>
      <ToastContainer />

      <div className="min-h-screen py-16 px-4 relative overflow-hidden">

        {/* 额外背景装饰：大光晕 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
          <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ddd6fe, transparent)' }} />
          {['top-[8%] left-[18%]','top-[20%] right-[12%]','top-[55%] left-[8%]','bottom-[20%] right-[18%]','bottom-[8%] left-[40%]'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-white/10 select-none text-2xl`}>✦</div>
          ))}
        </div>

        <div className="relative w-full mx-auto" style={{ maxWidth: '70vw', minWidth: '320px' }}>

          {/* ===== 顶部标题（在卡片外，白色文字） ===== */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 mb-5 text-xs font-medium rounded-full
                             bg-white/15 text-white border border-white/20 tracking-widest backdrop-blur-sm">
              人工智能社交媒体助手
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              几秒钟内即可免费生成<br />社交媒体帖子。
            </h1>

            <p className="text-white/60 text-base max-w-lg mx-auto mb-8">
              使用我们免费的AI社交媒体帖子生成器，保持内容创作的连贯性和高效性。
            </p>

            {/* 平台图标 */}
            <div className="flex justify-center flex-wrap gap-3">
              {PLATFORM_ICONS.map(p => (
                <div key={p.label} title={p.label}
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${p.bg}
                              shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-200 cursor-pointer`}>
                  {p.icon}
                </div>
              ))}
            </div>
          </div>

          {/* ===== 悬浮主卡片 ===== */}
          <div className="
            bg-white
            rounded-3xl
            shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]
            overflow-hidden
          ">
            <div className="p-10 space-y-8">

              {/* ⭐ FormPanel 替换原来的 InputModule + ConfigPanel */}
              <FormPanel
                textInput={textInput}
                onTextChange={setTextInput}
                urlInput={urlInput}
                onURLChange={setUrlInput}
                selectedFile={selectedFile}
                onFileChange={setSelectedFile}
                isAnalyzing={isAnalyzing}
                onAnalyzeURL={handleAnalyzeURL}
                onModeChange={setInputMode}
                platform={platform}
                onPlatformChange={setPlatform}
                onConfigChange={(config) => {
                  setTone(config.tone);
                  setWordLimit(config.wordLimit);
                  setGenerateCount(config.generateCount);
                  setUseHashtags(config.useHashtags);
                  setUseEmojis(config.useEmojis);
                  setCreativity(config.creativity);
                  setTargetAudience(config.targetAudience);
                  setMustInclude(config.mustInclude);
                  setMustExclude(config.mustExclude);
                }}
              />

              <hr className="border-gray-100" />

              {/* Agentic 模式 */}
              <div className="flex justify-between items-center px-5 py-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm text-base">🤖</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Agentic 智能工作流</p>
                    <p className="text-xs text-gray-400">启用多阶段规划与执行</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-purple-600"
                  checked={useAgenticMode}
                  onChange={e => setUseAgenticMode(e.target.checked)}
                />
              </div>

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-4 text-base font-semibold rounded-2xl text-white transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-purple-400/40 hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    生成中...
                  </span>
                ) : useAgenticMode ? '启动智能工作流' : '生成帖子'}
              </button>
            </div>
          </div>

          {/* ===== 工作流卡片 ===== */}
          {showWorkflow && (
            <div className="mt-6 bg-white rounded-3xl p-8
                            shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3)]">
              <WorkflowVisualizer isActive={showWorkflow} onComplete={() => console.log('工作流完成')} />
            </div>
          )}

          {/* ===== 结果卡片 ===== */}
          {results.length > 0 && (
            <div id="results-section"
              className="mt-6 bg-white rounded-3xl p-8
                         shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3)]">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">生成结果</h3>
              <ResultDisplay
                isLoading={false}
                results={results}
                onRegenerate={(id) => showToast('🔄 正在重新生成...', 'info')}
                onEdit={(id) => showToast('✏️ 编辑模式已开启', 'info')}
              />
            </div>
          )}

        </div>
      </div>
    </ErrorBoundary>
  );
}