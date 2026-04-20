'use client';

import React, { useState, useEffect } from 'react';

// ─── Toggle 组件 ──────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-purple-600' : 'bg-gray-200'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}

// ─── 原 InputModule 类型 ──────────────────────────────────
type InputMode = 'text' | 'document';

// ─── 原 ConfigPanel 类型 ──────────────────────────────────
type Platform = '小红书' | '抖音' | '微博' | '知乎';

// ─── 合并后的 Props ───────────────────────────────────────
type FormPanelProps = {
  // InputModule props
  textInput: string;
  onTextChange: React.Dispatch<React.SetStateAction<string>>;
  selectedFile: File | null;
  onFileChange: React.Dispatch<React.SetStateAction<File | null>>;
  onModeChange?: (mode: InputMode) => void;

  // ConfigPanel props
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
  onConfigChange?: (config: {
    tone: string;
    wordLimit: number;
    generateCount: number;
    useHashtags: boolean;
    useEmojis: boolean;
    creativity: '保守' | '平衡' | '创新';
    targetAudience: string;
    mustInclude: string;
    mustExclude: string;
  }) => void;
};

export default function FormPanel({
  // InputModule props
  textInput,
  onTextChange,
  selectedFile,
  onFileChange,
  onModeChange,
  // ConfigPanel props
  platform,
  onPlatformChange,
  onConfigChange,
}: FormPanelProps) {

  // ─── 原 InputModule state ─────────────────────────────
  const [inputMode, setInputMode] = useState<InputMode>('text');

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  // ─── 原 ConfigPanel state ─────────────────────────────
  const [tone, setTone] = useState('专业 Professional');
  const [wordLimit, setWordLimit] = useState(300);
  const [generateCount, setGenerateCount] = useState(3);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ─── 高级选项 state ───────────────────────────────────
  const [creativity, setCreativity] = useState<'保守' | '平衡' | '创新'>('平衡');
  const [targetAudience, setTargetAudience] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [mustExclude, setMustExclude] = useState('');

  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({
        tone, wordLimit, generateCount, useHashtags, useEmojis,
        creativity, targetAudience, mustInclude, mustExclude,
      });
    }
  }, [tone, wordLimit, generateCount, useHashtags, useEmojis, creativity, targetAudience, mustInclude, mustExclude]);

  const platformConfig = {
    '小红书': { maxWords: 1000, defaultWords: 300, features: ['话题标签', 'Emoji表情', '图文排版', '种草引导'], tips: '小红书用户喜欢真实、生活化的内容，建议使用轻松友好的语气' },
    '抖音':   { maxWords: 100,  defaultWords: 50,  features: ['热门话题', 'BGM推荐', '视频脚本', '爆款标题'],  tips: '抖音内容要简短有力，前3秒抓住眼球，多用疑问句和悬念' },
    '微博':   { maxWords: 140,  defaultWords: 100, features: ['话题标签', '长微博', '@提及', '转发引导'],     tips: '微博内容要简洁有趣，善用话题标签增加曝光' },
    '知乎':   { maxWords: 2000, defaultWords: 500, features: ['专业分析', '数据引用', '逻辑论证', '案例分享'], tips: '知乎用户重视专业性和深度，建议提供详细论证和数据支持' },
  };

  const config = platformConfig[platform];

  // ─── Render ───────────────────────────────────────────
  return (
    <div>

      {/* ══════ 原 InputModule JSX ══════ */}
      <div className="space-y-8">

        {/* 输入方式切换 */}
        <div className="grid grid-cols-2 bg-gray-50 rounded-2xl p-2">
          {['text','document'].map(mode => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode as InputMode)}
              className={`py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                inputMode === mode
                  ? 'bg-white shadow-md text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {mode==='text'?'文字输入':'文档上传'}
            </button>
          ))}
        </div>

        {/* 文字输入 */}
        {inputMode==='text' && (
          <textarea
            value={textInput}
            onChange={e=>onTextChange(e.target.value)}
            placeholder="例如：为新产品生成一篇小红书种草文案，语气活泼一点..."
            className="w-full min-h-[200px] px-6 py-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none transition"
          />
        )}

        {/* 文档上传 */}
        {inputMode==='document' && (
          <div>
            {!selectedFile ? (
              <label className="block p-10 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer text-center bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  className="hidden"
                  onChange={e=>onFileChange(e.target.files?.[0]??null)}
                />
                <div className="text-lg font-medium text-gray-700">
                  📂 点击上传
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  支持 Word / TXT
                </div>
              </label>
            ) : (
              <div className="flex justify-between items-center p-5 border border-gray-200 rounded-2xl bg-gray-50">
                <div className="text-base">
                  {selectedFile.name} ({(selectedFile.size/1024).toFixed(1)} KB)
                </div>
                <button
                  onClick={()=>onFileChange(null)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════ 原 ConfigPanel JSX ══════ */}
      <div className="space-y-6 mt-6">

        {/* 平台和语气选择 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">目标平台</label>
            <select
              value={platform}
              onChange={(e) => onPlatformChange(e.target.value as Platform)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>小红书</option>
              <option>抖音</option>
              <option>微博</option>
              <option>知乎</option>
            </select>
            <p className="mt-2 text-xs text-gray-400">{config.tips}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">内容语气</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <optgroup label="正式专业">
                <option>专业 Professional</option>
                <option>正式 Formal</option>
                <option>商务 Business</option>
                <option>学术 Academic</option>
                <option>技术向 Technical</option>
              </optgroup>
              <optgroup label="友好轻松">
                <option>休闲 Casual</option>
                <option>友好 Friendly</option>
                <option>温暖 Warm</option>
                <option>幽默 Humorous</option>
              </optgroup>
              <optgroup label="激励启发">
                <option>鼓励 Motivational</option>
                <option>灵感启发 Inspirational</option>
                <option>故事叙述 Storytelling</option>
              </optgroup>
              <optgroup label="营销推广">
                <option>宣传推广 Promotional</option>
                <option>营销 Marketing</option>
                <option>品牌语气 Branding</option>
                <option>吸睛 Hook Style</option>
              </optgroup>
              <optgroup label="平台特色">
                <option>小红书种草 Little Red Book Style</option>
                <option>抖音爆款 Douyin Viral Style</option>
                <option>知乎专业讨论 Zhihu Expert Style</option>
                <option>LinkedIn 商务专业 LinkedIn Corporate</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* 字数控制 */}
        {(platform === '小红书' || platform === '知乎') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">内容字数: {wordLimit} 字</label>
            <input
              type="range"
              min="100"
              max={config.maxWords}
              step="50"
              value={wordLimit}
              onChange={(e) => setWordLimit(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>100 字</span>
              <span>{config.maxWords} 字</span>
            </div>
          </div>
        )}

        {/* 基础选项 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">变体数量</label>
          <select
            value={generateCount}
            onChange={(e) => setGenerateCount(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 个版本</option>
            <option value={2}>2 个版本</option>
            <option value={3}>3 个版本</option>
            <option value={5}>5 个版本</option>
          </select>
        </div>

        {/* 开关行 */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">添加话题标签</span>
            <Toggle checked={useHashtags} onChange={() => setUseHashtags(!useHashtags)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">添加表情符号</span>
            <Toggle checked={useEmojis} onChange={() => setUseEmojis(!useEmojis)} />
          </div>
        </div>

        {/* 高级选项折叠面板 */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            高级选项
          </button>
          {showAdvanced && (
            <div className="pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">创意度</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['保守', '平衡', '创新'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setCreativity(level)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        creativity === level
                          ? 'bg-purple-600 text-white border border-purple-600'
                          : 'border border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">目标受众</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  placeholder="例如：25-35岁职场白领、科技爱好者..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">必须包含的关键词</label>
                <input
                  type="text"
                  value={mustInclude}
                  onChange={e => setMustInclude(e.target.value)}
                  placeholder="用逗号分隔，例如：AI, 效率, 创新"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">避免使用的词汇</label>
                <input
                  type="text"
                  value={mustExclude}
                  onChange={e => setMustExclude(e.target.value)}
                  placeholder="用逗号分隔，例如：贵、老、土"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}