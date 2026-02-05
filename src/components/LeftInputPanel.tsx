'use client';

import { useState } from 'react';

type InputMode = 'text' | 'url' | 'document';
type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface LeftInputPanelProps {
  onGenerate: () => void;
  isLoading: boolean;
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export default function LeftInputPanel({ 
  onGenerate, 
  isLoading,
  platform,
  onPlatformChange 
}: LeftInputPanelProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [tone, setTone] = useState('Professional');
  const [wordLimit, setWordLimit] = useState(500);
  const [useEmoji, setUseEmoji] = useState(true);
  const [useHashtag, setUseHashtag] = useState(true);
  const [generateCount, setGenerateCount] = useState(3);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 平台图标
  const platformIcons = {
    '小红书': '📕',
    '抖音': '🎵',
    '微博': '📱',
    '知乎': '❓'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-20">
      {/* 1. 输入方式切换 - Tab 组件 */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              inputMode === 'text'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            文本输入
            {inputMode === 'text' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              inputMode === 'url'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            URL 分析
            {inputMode === 'url' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setInputMode('document')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              inputMode === 'document'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            文档上传
            {inputMode === 'document' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* 2. 输入卡片 */}
      <div className="mb-6">
        {inputMode === 'text' && (
          <div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="例如：帮我生成一条关于 AI 自动化的小红书推文..."
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-inner text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">{textInput.length} 字</p>
          </div>
        )}

        {inputMode === 'url' && (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/article"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                分析
              </button>
            </div>
            {urlInput && (
              <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">域名：example.com</p>
                <p className="text-xs text-gray-600">状态：待分析</p>
              </div>
            )}
          </div>
        )}

        {inputMode === 'document' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input type="file" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">点击上传或拖拽文件</p>
              <p className="text-xs text-gray-500 mt-1">支持 PDF、Word、TXT</p>
            </label>
          </div>
        )}
      </div>

      {/* 3. 平台选择 - 按钮组 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">平台</label>
        <div className="grid grid-cols-4 gap-2">
          {(['小红书', '抖音', '微博', '知乎'] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => onPlatformChange(p)}
              className={`px-3 py-2 text-xs font-medium rounded border transition ${
                platform === p
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{platformIcons[p]}</span>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 语气选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">语气</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="Professional">Professional</option>
          <option value="Casual">Casual</option>
          <option value="Friendly">Friendly</option>
          <option value="Humorous">Humorous</option>
        </select>
      </div>

      {/* 5. 高级选项 - 可折叠 */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>▸ 高级生成设置</span>
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
            {/* 字数滑块 */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">字数限制: {wordLimit}</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Emoji 开关 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">使用 Emoji</span>
              <input
                type="checkbox"
                checked={useEmoji}
                onChange={(e) => setUseEmoji(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            {/* Hashtag 开关 */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">使用 Hashtag</span>
              <input
                type="checkbox"
                checked={useHashtag}
                onChange={(e) => setUseHashtag(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            {/* 生成数量 */}
            <div>
              <label className="block text-xs text-gray-600 mb-2">生成数量</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGenerateCount(Math.max(1, generateCount - 1))}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                >
                  −
                </button>
                <span className="flex-1 text-center text-sm font-medium">{generateCount}</span>
                <button
                  onClick={() => setGenerateCount(Math.min(5, generateCount + 1))}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. 生成按钮 - 底部固定 */}
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </span>
        ) : (
          '🚀 开始 Agent 生成'
        )}
      </button>
    </div>
  );
}