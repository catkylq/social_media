'use client';

import { useState } from 'react';

interface AnalysisResult {
  url: string;
  title: string;
  summary: string;
  wordCount: number;
  readingTime: number;
  keywords: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  targetAudience: string[];
  contentType: string;
  relevanceScore: number;
  marketingInsights: {
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  };
  platformRecommendations: {
    platform: string;
    score: number;
    reason: string;
  }[];
}

interface URLAnalysisDisplayProps {
  isAnalyzing: boolean;
  result?: AnalysisResult;
  onClose?: () => void;
}

export default function URLAnalysisDisplay({ 
  isAnalyzing, 
  result,
  onClose 
}: URLAnalysisDisplayProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  if (!isAnalyzing && !result) return null;

  // 加载状态
  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              正在分析网页内容...
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>提取网页内容</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                <span>分析主题和关键词</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-400"></div>
                <span>生成营销建议</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  // 情感色彩映射
  const sentimentConfig = {
    positive: { color: 'text-green-600', bg: 'bg-green-100', label: '积极正面', icon: '😊' },
    neutral: { color: 'text-gray-600', bg: 'bg-gray-100', label: '中性客观', icon: '😐' },
    negative: { color: 'text-red-600', bg: 'bg-red-100', label: '消极负面', icon: '😔' }
  };

  const sentiment = sentimentConfig[result.sentiment];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg mb-6 overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">🔍</span>
              <h3 className="text-xl font-bold text-white">
                URL 内容分析报告
              </h3>
            </div>
            <p className="text-blue-100 text-sm mb-3 break-all">
              {result.url}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                📄 {result.contentType}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                📊 {result.wordCount} 字
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                ⏱️ {result.readingTime} 分钟阅读
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* 核心信息概览 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-200">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full flex items-center justify-between"
          >
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>📋</span>
              <span>内容概览</span>
            </h4>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection === 'overview' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'overview' && (
            <div className="mt-4 space-y-4">
              {/* 标题 */}
              <div>
                <label className="text-sm font-medium text-gray-600">文章标题</label>
                <p className="mt-1 text-gray-900 font-medium">{result.title}</p>
              </div>

              {/* 摘要 */}
              <div>
                <label className="text-sm font-medium text-gray-600">内容摘要</label>
                <p className="mt-1 text-gray-700 leading-relaxed">{result.summary}</p>
              </div>

              {/* 情感倾向 */}
              <div>
                <label className="text-sm font-medium text-gray-600">情感倾向</label>
                <div className="mt-2">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 ${sentiment.bg} ${sentiment.color} rounded-full font-medium`}>
                    <span>{sentiment.icon}</span>
                    <span>{sentiment.label}</span>
                  </span>
                </div>
              </div>

              {/* 相关性评分 */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  营销价值评分
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${result.relevanceScore * 10}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {result.relevanceScore}/10
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 关键词和主题 */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <button
            onClick={() => toggleSection('keywords')}
            className="w-full flex items-center justify-between"
          >
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>🏷️</span>
              <span>关键词与主题</span>
            </h4>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection === 'keywords' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'keywords' && (
            <div className="mt-4 space-y-4">
              {/* 关键词 */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  核心关键词
                </label>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 主题标签 */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  相关主题
                </label>
                <div className="flex flex-wrap gap-2">
                  {result.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* 目标受众 */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  目标受众
                </label>
                <div className="flex flex-wrap gap-2">
                  {result.targetAudience.map((audience, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      👥 {audience}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 营销洞察 */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <button
            onClick={() => toggleSection('insights')}
            className="w-full flex items-center justify-between"
          >
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>💡</span>
              <span>营销洞察</span>
            </h4>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection === 'insights' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'insights' && (
            <div className="mt-4 space-y-4">
              {/* 内容优势 */}
              <div>
                <label className="text-sm font-medium text-green-700 mb-2 flex items-center space-x-1">
                  <span>✅</span>
                  <span>内容优势</span>
                </label>
                <ul className="space-y-2">
                  {result.marketingInsights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 营销机会 */}
              <div>
                <label className="text-sm font-medium text-blue-700 mb-2 flex items-center space-x-1">
                  <span>🎯</span>
                  <span>营销机会</span>
                </label>
                <ul className="space-y-2">
                  {result.marketingInsights.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 推广建议 */}
              <div>
                <label className="text-sm font-medium text-purple-700 mb-2 flex items-center space-x-1">
                  <span>💼</span>
                  <span>推广建议</span>
                </label>
                <ul className="space-y-2">
                  {result.marketingInsights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 平台推荐 */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <button
            onClick={() => toggleSection('platforms')}
            className="w-full flex items-center justify-between"
          >
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>📱</span>
              <span>平台推荐</span>
            </h4>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedSection === 'platforms' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'platforms' && (
            <div className="mt-4 space-y-3">
              {result.platformRecommendations.map((platform, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {platform.platform}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${platform.score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {platform.score}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{platform.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition">
            📝 基于分析生成内容
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
            💾 保存报告
          </button>
        </div>
      </div>
    </div>
  );
}