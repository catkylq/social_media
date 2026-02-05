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

  // URL 格式验证
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

  // 处理 URL 输入
  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    if (url) {
      validateURL(url);
    } else {
      setUrlError('');
    }
  };

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('仅支持 PDF、Word 和 TXT 格式');
      }
    }
  };

  // 分析 URL
  const handleAnalyzeURL = async () => {
    if (!validateURL(urlInput)) return;

    setIsAnalyzing(true);
    
    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 生成模拟分析结果
    const mockResult = {
      url: urlInput,
      title: '如何用AI提升内容创作效率：实战经验分享',
      summary: '本文详细介绍了AI工具在内容创作中的应用，包括多平台内容生成、智能优化、批量处理等功能。通过实际案例展示了如何将创作效率提升300%，同时保持内容质量。',
      wordCount: 2800,
      readingTime: 9,
      keywords: ['AI工具', '内容创作', '效率提升', '自动化', '多平台'],
      topics: ['人工智能', '内容营销', '工作效率', '自媒体运营'],
      sentiment: 'positive' as const,
      targetAudience: ['内容创作者', '自媒体运营者', '市场营销人员', '企业品牌方'],
      contentType: '实战指南',
      relevanceScore: 8.5,
      marketingInsights: {
        strengths: [
          '内容实用性强，有具体的使用案例和数据支持',
          '针对痛点明确，解决了创作者的效率问题',
          '多平台适配的特性具有明显竞争优势'
        ],
        opportunities: [
          '可以突出节省时间和成本的量化数据',
          '强调AI辅助而非替代，降低用户顾虑',
          '展示真实用户案例和成功故事'
        ],
        recommendations: [
          '在小红书发布时，使用种草风格，强调使用体验和效果对比',
          '知乎推广时，提供深度分析和数据支持，建立专业形象',
          '抖音内容要简短有力，前3秒展示最吸引人的效果数据',
          '添加限时优惠或免费试用等行动号召'
        ]
      },
      platformRecommendations: [
        {
          platform: '小红书',
          score: 9,
          reason: '工具类产品在小红书有很好的种草效果，目标用户高度匹配'
        },
        {
          platform: '知乎',
          score: 8.5,
          reason: '专业性强，适合深度内容分享，建立行业权威'
        },
        {
          platform: '抖音',
          score: 7,
          reason: '短视频形式可以快速展示工具效果，适合吸引新用户'
        },
        {
          platform: '微博',
          score: 6.5,
          reason: '话题传播快，适合配合热点进行推广'
        }
      ]
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  // 拖拽上传
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-5">
      {/* URL 分析结果展示 */}
      <URLAnalysisDisplay
        isAnalyzing={isAnalyzing}
        result={analysisResult}
        onClose={() => setAnalysisResult(null)}
      />

      {/* 输入方式选择 - 和平台选择一样的格式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          输入方式
        </label>
        <select
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value as InputMode)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="text">📝 文字描述</option>
          <option value="url">🔗 网址链接</option>
          <option value="document">📄 文档上传</option>
        </select>
      </div>

      {/* 文字输入模式 */}
      {inputMode === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            内容描述
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="请描述您想要创作的内容，例如：为我们的新产品写一篇小红书帖子..."
            className="w-full h-32 px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-all"
          />
          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-gray-500">已输入 {textInput.length} 字</span>
            {textInput.length > 500 && (
              <span className="text-amber-600">⚠️ 建议不超过 500 字</span>
            )}
          </div>
        </div>
      )}

      {/* URL 输入模式 */}
      {inputMode === 'url' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            网址链接
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={urlInput}
                  onChange={handleURLChange}
                  placeholder="https://example.com/article"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    urlError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {urlInput && !urlError && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-green-500">✓</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAnalyzeURL}
                disabled={!urlInput || !!urlError || isAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isAnalyzing ? '分析中...' : '🔍 分析'}
              </button>
            </div>
            
            {urlError && (
              <p className="text-sm text-red-600">
                {urlError}
              </p>
            )}
            
            <p className="text-sm text-gray-500">
              💡 支持博客文章、新闻报道、产品页面等公开网页
            </p>
          </div>
        </div>
      )}

      {/* 文档上传模式 */}
      {inputMode === 'document' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文档上传
          </label>
          
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">
                      点击上传或拖拽文件
                    </p>
                    <p className="text-xs text-gray-500">
                      支持 PDF、Word、TXT，最大 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📄</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}