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
  onOptimize: (feedback: string) => void;
}

export default function FeedbackPanel({ 
  contentId, 
  originalContent,
  onOptimize 
}: FeedbackPanelProps) {
  const [feedback, setFeedback] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: originalContent,
      timestamp: new Date()
    }
  ]);

  // 快捷建议
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

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: feedback,
      timestamp: new Date()
    };

    setConversationHistory([...conversationHistory, userMessage]);

    // 模拟 AI 优化
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 添加 AI 回复（模拟优化后的内容）
    const aiMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: generateOptimizedContent(originalContent, feedback),
      timestamp: new Date()
    };

    setConversationHistory([...conversationHistory, userMessage, aiMessage]);
    setFeedback('');
    setIsOptimizing(false);
    setShowHistory(true);

    // 通知父组件
    onOptimize(feedback);
  };

  // 生成优化后的内容（模拟）
  const generateOptimizedContent = (original: string, userFeedback: string) => {
    // 根据反馈类型返回不同的优化版本
    if (userFeedback.includes('友好') || userFeedback.includes('轻松')) {
      return original + '\n\n😊 希望这个分享对你有帮助！有问题随时来问我～';
    } else if (userFeedback.includes('数据') || userFeedback.includes('支持')) {
      return original + '\n\n📊 根据调查数据显示，使用AI工具的创作者效率平均提升了300%，内容互动率提高了35%。';
    } else if (userFeedback.includes('emoji') || userFeedback.includes('表情')) {
      return original.split('\n').map(line => 
        line ? '✨ ' + line : line
      ).join('\n');
    } else if (userFeedback.includes('缩短') || userFeedback.includes('简短')) {
      return '🔥 发现超实用AI工具！\n\n多平台支持，20+语气可选，一键生成多版本。\n\n效率提升300%，强烈推荐！💯';
    } else {
      return original + '\n\n💡 已根据您的建议进行优化调整。';
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setFeedback(suggestion);
  };

  return (
    <div className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题区域 */}
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

        {/* 对话历史 */}
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
                  
                  {/* 版本对比标记 */}
                  {index > 0 && message.role === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-gray-300/30">
                      <span className="text-xs opacity-75">
                        📝 版本 {Math.floor(index / 2) + 1}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 快捷建议 */}
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

        {/* 反馈输入框 */}
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

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOptimize}
              disabled={!feedback.trim() || isOptimizing}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isOptimizing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  优化中...
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
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                重新开始
              </button>
            )}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>提示：</strong>
            你可以多轮优化内容，AI 会记住之前的对话历史，逐步完善内容直到满意为止。
          </p>
        </div>

        {/* 优化统计 */}
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