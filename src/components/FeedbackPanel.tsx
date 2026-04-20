'use client';

import { useState } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FeedbackPanelProps {
  contentId: number;
  originalContent: string;
  platform?: string;
  tone?: string;
  wordLimit?: number;
  onOptimize: (optimizedContent: string) => void;
}

export default function FeedbackPanel({
  contentId,
  originalContent,
  platform = '小红书',
  tone = '专业',
  wordLimit = 300,
  onOptimize
}: FeedbackPanelProps) {
  const [feedback, setFeedback] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: originalContent,
      timestamp: new Date()
    }
  ]);

  const quickSuggestions = [
    '让语气更友好一些',
    '增加一些数据支持',
    '添加更多 emoji',
    '缩短到100字以内',
    '突出产品优势',
    '加入行动号召'
  ];

  const handleOptimize = async () => {
    if (!feedback.trim()) return;

    setIsOptimizing(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: feedback,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalContent,
          userFeedback: feedback,
          platform,
          tone,
          wordLimit,
          conversationHistory: conversationHistory.slice(1).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '优化失败');
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.optimizedContent,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      setFeedback('');
      setShowHistory(true);
      onOptimize(data.optimizedContent);

    } catch (err: any) {
      setError(err.message || '优化过程中出现错误，请稍后重试');
      setConversationHistory(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setFeedback(suggestion);
  };

  const handleCopy = async (content: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI 协同优化
            </h3>
          </div>

          {conversationHistory.length > 1 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showHistory ? '隐藏历史 ▲' : `查看历史 (${conversationHistory.length - 1}) ▼`}
            </button>
          )}
        </div>

        {showHistory && conversationHistory.length > 1 && (
          <div className="mb-4 max-h-96 overflow-y-auto space-y-3 bg-white rounded-lg border border-gray-200 p-4">
            {conversationHistory.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="text-xs opacity-75">
                      {message.role === 'user' ? '👤 你' : '🤖 AI'}
                    </span>
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>

                  {index > 0 && message.role === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-gray-300/30 flex items-center justify-between">
                      <span className="text-xs opacity-75">
                        📝 版本 {Math.floor(index / 2) + 1}
                      </span>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className={`text-xs px-2 py-1 rounded transition ${
                          copiedId === message.id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {copiedId === message.id ? '✓ 已复制' : '📋 复制'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">⚠️</span>
              <div>
                <p className="text-sm text-red-700 font-medium">优化失败</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💡 快捷建议
          </label>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleQuickSuggestion(suggestion)}
                disabled={isOptimizing}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            告诉 AI 如何改进
          </label>
          <div className="relative">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="例如：让语气更友好一些，添加一些具体数据支持..."
              disabled={isOptimizing}
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {feedback.length} 字
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOptimize}
              disabled={!feedback.trim() || isOptimizing}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isOptimizing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  AI 优化中...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  立即优化
                </>
              )}
            </button>

            {conversationHistory.length > 1 && (
              <button
                onClick={() => {
                  setConversationHistory([conversationHistory[0]]);
                  setFeedback('');
                  setShowHistory(false);
                  setError(null);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                重新开始
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>提示：</strong>
            你可以多轮优化内容，AI 会记住之前的对话历史，逐步完善内容直到满意为止。
          </p>
        </div>

        {conversationHistory.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">
                {Math.floor((conversationHistory.length - 1) / 2)}
              </span>
              {' '}次优化
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div>
              <span className="font-medium text-gray-900">
                {conversationHistory.length}
              </span>
              {' '}条消息
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div>
              当前版本:{' '}
              <span className="font-medium text-blue-600">
                v{Math.floor((conversationHistory.length - 1) / 2) + 1}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
