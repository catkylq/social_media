'use client';

import { useState } from 'react';
import URLAnalysisDisplay from './URLAnalysisDisplay';

type InputMode = 'text' | 'url' | 'document';

export default function InputModule() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  /* ---------------- URL 校验 ---------------- */
  const validateURL = (url: string) => {
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch {
      setUrlError('请输入有效的 URL 地址');
      return false;
    }
  };

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    url ? validateURL(url) : setUrlError('');
  };

  /* ---------------- 文件上传 ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('仅支持 PDF、Word、TXT 文件');
      return;
    }

    setSelectedFile(file);
  };

  /* ---------------- URL 分析 ---------------- */
  const handleAnalyzeURL = async () => {
    if (!validateURL(urlInput)) return;

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    setAnalysisResult({
      url: urlInput,
      title: '如何用 AI 提升内容创作效率',
      summary:
        '本文介绍了 AI 在内容创作中的实际应用场景，并通过案例展示了效率提升的可能性。',
      wordCount: 2800,
      readingTime: 9,
      keywords: ['AI', '内容创作', '效率提升'],
      sentiment: 'positive',
    });

    setIsAnalyzing(false);
  };

  /* ---------------- 拖拽 ---------------- */
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* 主 AI 卡片 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">

        {/* 分析结果 */}
        <URLAnalysisDisplay
          isAnalyzing={isAnalyzing}
          result={analysisResult}
          onClose={() => setAnalysisResult(null)}
        />

        {/* 输入方式切换 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            输入方式
          </label>

          <div className="grid grid-cols-3 bg-gray-100 rounded-full p-1">
            {[
              { key: 'text', label: '📝 文字' },
              { key: 'url', label: '🔗 链接' },
              { key: 'document', label: '📄 文档' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setInputMode(item.key as InputMode)}
                className={`py-2 text-sm font-medium rounded-full transition
                  ${
                    inputMode === item.key
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 文字输入 */}
        {inputMode === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容描述
            </label>
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="例如：为新产品生成一篇小红书推广文案"
              className="w-full min-h-[140px] px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>已输入 {textInput.length} 字</span>
              {textInput.length > 500 && (
                <span className="text-amber-600">建议不超过 500 字</span>
              )}
            </div>
          </div>
        )}

        {/* URL 输入 */}
        {inputMode === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              网页链接
            </label>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  value={urlInput}
                  onChange={handleURLChange}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 border rounded-full focus:ring-2 focus:ring-blue-500
                    ${urlError ? 'border-red-300' : 'border-gray-300'}`}
                />
                {urlInput && !urlError && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </span>
                )}
              </div>

              <button
                onClick={handleAnalyzeURL}
                disabled={!urlInput || !!urlError || isAnalyzing}
                className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600
                           text-white rounded-full font-medium shadow-sm hover:shadow-md
                           transition disabled:opacity-50"
              >
                {isAnalyzing ? '分析中...' : '🔍 分析'}
              </button>
            </div>

            {urlError && <p className="mt-1 text-sm text-red-600">{urlError}</p>}
            <p className="mt-2 text-sm text-gray-500">
              支持博客、新闻、产品页面等公开网页
            </p>
          </div>
        )}

        {/* 文档上传 */}
        {inputMode === 'document' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传文档
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-2xl
                           bg-gradient-to-br from-gray-50 to-white
                           p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition"
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="font-medium text-gray-700">
                    点击上传或拖拽文件
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF / Word / TXT，≤ 10MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI 分析中提示 */}
        {isAnalyzing && (
          <div className="flex items-center justify-center gap-3 py-4 text-sm text-gray-500">
            <span className="animate-pulse">🤖</span>
            AI 正在分析内容，请稍候…
          </div>
        )}
      </div>
    </div>
  );
}
