'use client';

import { useState } from 'react';
import InputModule from './InputModule';
import ConfigPanel from './ConfigPanel';
import ResultDisplay from './ResultDisplay';
import WorkflowVisualizer from './WorkflowVisualizer';
import { useToast } from './ToastNotification';
import ErrorBoundary from './ErrorBoundary';

type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface GeneratedContent {
  id: number;
  content: string;
  platform: string;
  createdAt: Date;
}

export default function CompleteGenerator() {
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

  // ✅ 新增：配置参数 state
  const [tone, setTone] = useState('专业 Professional');
  const [wordLimit, setWordLimit] = useState(300);
  const [generateCount, setGenerateCount] = useState(1);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);

  const { showToast, ToastContainer } = useToast();

  // 真实 API 生成内容
  const handleGenerate = async () => {
    if (inputMode !== 'text') {
      showToast('⚠️ 当前仅支持文字输入生成内容', 'warning');
      return;
    }

    if (!textInput.trim()) {
      showToast('⚠️ 请先输入文字内容', 'warning');
      return;
    }

    setIsLoading(true);
    setShowWorkflow(useAgenticMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText: textInput,
          platform,
          tone,
          wordLimit,
          generateCount,
          useHashtags,
          useEmojis,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();

      const apiResults: GeneratedContent[] = (data.results || []).map((item: any) => ({
        id: item.id,
        content: item.content,
        platform: item.platform,
        createdAt: new Date(item.createdAt),
      }));

      setResults(apiResults);
      showToast('🎉 内容生成成功！', 'success');
    } catch (err: any) {
      console.error('API Error:', err);
      showToast('❌ 内容生成失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
      setShowWorkflow(false);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  const handleRegenerate = (id: number) =>
    showToast('🔄 正在重新生成...', 'info');

  const handleEdit = (id: number) =>
    showToast('✏️ 编辑模式已开启', 'info');

  const handleAnalyzeURL = async () => {
    if (!urlInput) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    showToast('🔍 URL 分析完成', 'success');
  };

  return (
    <ErrorBoundary>
      <ToastContainer />

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-8 space-y-10">

        {/* 输入与配置 */}
        <section className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🎯 需求输入与配置
            <span className="text-sm text-gray-500">(用户控制)</span>
          </h3>

          <InputModule
            textInput={textInput}
            onTextChange={setTextInput}
            urlInput={urlInput}
            onURLChange={setUrlInput}
            selectedFile={selectedFile}
            onFileChange={setSelectedFile}
            isAnalyzing={isAnalyzing}
            onAnalyzeURL={handleAnalyzeURL}
            onModeChange={setInputMode}
          />

          {/* ✅ 修改这里：增加 onConfigChange */}
          <ConfigPanel
            platform={platform}
            onPlatformChange={setPlatform}
            onConfigChange={(config) => {
              setTone(config.tone);
              setWordLimit(config.wordLimit);
              setGenerateCount(config.generateCount);
              setUseHashtags(config.useHashtags);
              setUseEmojis(config.useEmojis);
            }}
          />

          {/* Agentic 开关 */}
          <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                🤖
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Agentic 智能工作流
                </h4>
                <p className="text-xs text-gray-500">
                  启用多阶段规划与执行
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={useAgenticMode}
              onChange={e => setUseAgenticMode(e.target.checked)}
            />
          </div>
        </section>

        {/* 执行控制 */}
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🤖 执行控制
            <span className="text-sm text-gray-500">(启动生成)</span>
          </h3>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? '⏳ 生成中...'
              : useAgenticMode
              ? '🤖 启动智能工作流'
              : '🚀 生成内容'}
          </button>
        </section>

        {/* Agent 工作流 */}
        {showWorkflow && (
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <WorkflowVisualizer
              isActive={showWorkflow}
              onComplete={() => console.log('工作流完成')}
            />
          </section>
        )}

        {/* 生成结果 */}
        <section
          id="results-section"
          className="bg-slate-50 rounded-xl p-6 border border-slate-200"
        >
          <ResultDisplay
            isLoading={isLoading && !showWorkflow}
            results={results}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
          />
        </section>
      </div>
    </ErrorBoundary>
  );
}
