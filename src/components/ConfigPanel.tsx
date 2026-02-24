// 'use client';

// import { useState } from 'react';

// type Platform = '小红书' | '抖音' | '微博' | '知乎';

// interface ConfigPanelProps {
//   platform: Platform;
//   onPlatformChange: (platform: Platform) => void;
// }

// export default function ConfigPanel({ platform, onPlatformChange }: ConfigPanelProps) {
//   const [tone, setTone] = useState('专业 Professional');
//   const [wordLimit, setWordLimit] = useState(300);
//   const [generateCount, setGenerateCount] = useState(3);
//   const [useHashtags, setUseHashtags] = useState(true);
//   const [useEmojis, setUseEmojis] = useState(true);
//   const [showAdvanced, setShowAdvanced] = useState(false);

'use client';

import { useState, useEffect } from 'react';

type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface ConfigPanelProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;

  // ✅ 新增：向父组件同步参数
  onConfigChange?: (config: {
    tone: string;
    wordLimit: number;
    generateCount: number;
    useHashtags: boolean;
    useEmojis: boolean;
  }) => void;
}

export default function ConfigPanel({
  platform,
  onPlatformChange,
  onConfigChange,
}: ConfigPanelProps) {
  const [tone, setTone] = useState('专业 Professional');
  const [wordLimit, setWordLimit] = useState(300);
  const [generateCount, setGenerateCount] = useState(3);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ✅ 新增：当配置变化时通知父组件
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({
        tone,
        wordLimit,
        generateCount,
        useHashtags,
        useEmojis,
      });
    }
  }, [tone, wordLimit, generateCount, useHashtags, useEmojis]);





  // 平台特定配置
  const platformConfig = {
    '小红书': {
      maxWords: 1000,
      defaultWords: 300,
      features: ['话题标签', 'Emoji表情', '图文排版', '种草引导'],
      tips: '小红书用户喜欢真实、生活化的内容，建议使用轻松友好的语气'
    },
    '抖音': {
      maxWords: 100,
      defaultWords: 50,
      features: ['热门话题', 'BGM推荐', '视频脚本', '爆款标题'],
      tips: '抖音内容要简短有力，前3秒抓住眼球，多用疑问句和悬念'
    },
    '微博': {
      maxWords: 140,
      defaultWords: 100,
      features: ['话题标签', '长微博', '@提及', '转发引导'],
      tips: '微博内容要简洁有趣，善用话题标签增加曝光'
    },
    '知乎': {
      maxWords: 2000,
      defaultWords: 500,
      features: ['专业分析', '数据引用', '逻辑论证', '案例分享'],
      tips: '知乎用户重视专业性和深度，建议提供详细论证和数据支持'
    }
  };

  const config = platformConfig[platform];

  return (
    <div className="space-y-6">
      {/* 平台和语气选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 目标平台 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            目标平台
          </label>
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
          
          {/* 平台提示 */}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 {config.tips}
            </p>
          </div>
        </div>

        {/* 内容语气 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            内容语气
          </label>
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

      {/* 平台特定功能 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          平台特色功能
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {config.features.map((feature) => (
            <div 
              key={feature}
              className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700 text-center"
            >
              ✨ {feature}
            </div>
          ))}
        </div>
      </div>

      {/* 字数控制（部分平台） */}
      {(platform === '小红书' || platform === '知乎') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            内容字数: {wordLimit} 字
          </label>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 生成数量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            生成数量
          </label>
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

        {/* Hashtags 开关 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            话题标签
          </label>
          <button
            onClick={() => setUseHashtags(!useHashtags)}
            className={`w-full px-4 py-3 rounded-lg font-medium transition ${
              useHashtags
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {useHashtags ? '✓ 包含标签' : '不含标签'}
          </button>
        </div>

        {/* Emoji 开关 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Emoji 表情
          </label>
          <button
            onClick={() => setUseEmojis(!useEmojis)}
            className={`w-full px-4 py-3 rounded-lg font-medium transition ${
              useEmojis
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {useEmojis ? '✓ 包含表情' : '不含表情'}
          </button>
        </div>
      </div>

      {/* 高级选项折叠面板 */}
<div className="border border-gray-200 rounded-md overflow-hidden">
  <button
    type="button"
    onClick={() => setShowAdvanced(!showAdvanced)}
    className="
      w-full
      px-3 py-2
      flex items-center justify-between
      bg-gray-50 hover:bg-gray-100
      transition
    "
  >
    {/* 左侧标题 */}
    <span className="text-sm font-medium text-gray-700">
      高级选项
    </span>

    {/* 右侧箭头（防止被拉伸） */}
    <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
      <svg
        className={`w-4 h-4 text-gray-500 transition-transform ${
          showAdvanced ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </span>
  </button>
        {showAdvanced && (
          <div className="p-4 space-y-4 bg-white">
            {/* 创意度控制 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                创意度
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-sm">
                  保守
                </button>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm">
                  平衡
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-sm">
                  创新
                </button>
              </div>
            </div>

            {/* 目标受众 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                目标受众
              </label>
              <input
                type="text"
                placeholder="例如：25-35岁职场白领、科技爱好者..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 关键词 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                必须包含的关键词
              </label>
              <input
                type="text"
                placeholder="用逗号分隔，例如：AI, 效率, 创新"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 避免的词汇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                避免使用的词汇
              </label>
              <input
                type="text"
                placeholder="用逗号分隔，例如：贵、老、土"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}