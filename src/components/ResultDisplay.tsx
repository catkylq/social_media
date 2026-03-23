'use client';

import { useState } from 'react';
import FeedbackPanel from './FeedbackPanel';

interface GeneratedContent {
  id: number;
  content: string;
  platform: string;
  createdAt: Date;
  score?: number;  // 后端可能返回的评分（0-100）
}

interface ResultDisplayProps {
  isLoading?: boolean;
  results?: GeneratedContent[];
  onRegenerate?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export default function ResultDisplay({ 
  isLoading = false, 
  results = [],
  onRegenerate,
  onEdit
}: ResultDisplayProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [feedbackOpenId, setFeedbackOpenId] = useState<number | null>(null);

  // 复制到剪贴板
  const handleCopy = async (content: string, id: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  // 将分数（0-100）转换为星星数量（0-5）
  const getStarCount = (score: number | undefined): number => {
    if (score === undefined) return 4; // 默认值（对应 80 分左右）
    return Math.round(score / 20);
  };

  // 格式化分数显示（保留一位小数，如果整数则显示整数）
  // const formatScore = (score: number | undefined): string => {
  //   if (score === undefined) return '8.5';
  //   if (score % 1 === 0) return score.toString();
  //   return score.toFixed(1);
  // };
  const formatScore = (score: number | undefined): string => {
  if (score === undefined) return '8.5';
  const decimalScore = score / 10;   // 百分制 → 十分制
  if (decimalScore % 1 === 0) return decimalScore.toString();
  return decimalScore.toFixed(1);
};

  // 加载状态
  if (isLoading) {
    return (
      <div className="bg-gray-50 border-t border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          {/* 加载动画 */}
          <div className="text-center">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              正在生成内容...
            </h3>
            <p className="text-gray-600 mb-6">
              AI 正在为您创作精彩内容，请稍候
            </p>
            
            {/* 骨架屏 */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            生成结果 ({results.length} 个版本)
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            导出全部
          </button>
        </div>

        {/* 结果卡片列表 */}
        {results.map((result, index) => {
          const score = result.score;
          const starCount = getStarCount(score);
          const formattedScore = formatScore(score);

          return (
            <div
              key={result.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* 卡片头部 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-semibold">
                      版本 {index + 1}
                    </span>
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
                      {result.platform}
                    </span>
                  </div>
                  <span className="text-xs text-white/80">
                    {result.createdAt.toLocaleTimeString('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>

              {/* 卡片内容 */}
              <div className="p-6">
                {/* 内容展示 */}
                <div className="mb-4">
                  <div 
                    className={`text-gray-800 whitespace-pre-wrap leading-relaxed ${
                      expandedId === result.id ? '' : 'line-clamp-6'
                    }`}
                  >
                    {result.content}
                  </div>
                  
                  {/* 展开/收起按钮 */}
                  {result.content.length > 200 && (
                    <button
                      onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                    >
                      {expandedId === result.id ? '收起 ↑' : '展开更多 ↓'}
                    </button>
                  )}
                </div>

                {/* 内容统计 */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4 pb-4 border-b">
                  <span>📝 {result.content.length} 字</span>
                  <span>⏱️ 预计阅读 {Math.ceil(result.content.length / 300)} 分钟</span>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-3">
                  {/* 复制按钮 */}
                  <button
                    onClick={() => handleCopy(result.content, result.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      copiedId === result.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copiedId === result.id ? (
                      <>
                        <span className="inline-block mr-1">✓</span>
                        已复制
                      </>
                    ) : (
                      <>
                        <span className="inline-block mr-1">📋</span>
                        复制内容
                      </>
                    )}
                  </button>

                  {/* 编辑按钮 */}
                  <button
                    onClick={() => setFeedbackOpenId(feedbackOpenId === result.id ? null : result.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      feedbackOpenId === result.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <span className="inline-block mr-1">
                      {feedbackOpenId === result.id ? '✓' : '✏️'}
                    </span>
                    {feedbackOpenId === result.id ? '关闭优化' : '编辑优化'}
                  </button>

                  {/* 重新生成按钮 */}
                  <button
                    onClick={() => onRegenerate?.(result.id)}
                    className="flex-1 py-2 px-4 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition"
                  >
                    <span className="inline-block mr-1">🔄</span>
                    重新生成
                  </button>

                  {/* 更多操作 */}
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 质量评分（动态） */}
              <div className="bg-gray-50 px-6 py-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">AI 质量评分</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= starCount ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">{formattedScore}/10</span>
                  </div>
                </div>
              </div>

              {/* 反馈优化面板 */}
              {feedbackOpenId === result.id && (
                <FeedbackPanel
                  contentId={result.id}
                  originalContent={result.content}
                  onOptimize={(feedback) => {
                    console.log('优化反馈:', feedback);
                    // TODO: 实现优化逻辑
                  }}
                />
              )}
            </div>
          );
        })}

        {/* 批量操作 */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition">
            全部导出为 PDF
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition">
            保存到草稿箱
          </button>
        </div>
      </div>
    </div>
  );
}