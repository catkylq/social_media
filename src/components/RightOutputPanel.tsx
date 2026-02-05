'use client';

import { useState } from 'react';

interface Step {
  id: number;
  name: string;
  status: 'pending' | 'processing' | 'completed';
}

interface RightOutputPanelProps {
  isLoading: boolean;
  showWorkflow: boolean;
  results: any[];
}

export default function RightOutputPanel({ 
  isLoading, 
  showWorkflow,
  results 
}: RightOutputPanelProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, name: '需求分析', status: 'completed' },
    { id: 2, name: '内容规划', status: 'completed' },
    { id: 3, name: '初稿生成', status: 'processing' },
    { id: 4, name: '扩展', status: 'pending' },
    { id: 5, name: '润色', status: 'pending' }
  ]);

  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});

  // 空状态
  if (!isLoading && !showWorkflow && results.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">等待生成</h3>
        <p className="text-sm text-gray-500">配置参数后点击生成按钮</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 1. Agent 工作流步骤条 */}
      {(isLoading || showWorkflow) && (
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* 步骤圆圈 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'processing'
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.status === 'completed' ? '✓' : step.id}
                  </div>
                  {/* 步骤名称 */}
                  <span className="text-xs text-gray-600 mt-2">{step.name}</span>
                </div>

                {/* 连接线 */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                      style={{ width: step.status === 'completed' ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 实时状态卡片 */}
      {isLoading && (
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">🤖 Agent 正在工作中</h4>
              <p className="text-sm text-blue-700">正在分析目标受众与传播目标...</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 中间结果展示 - 可折叠 */}
      {showWorkflow && (
        <div className="border-b border-gray-200">
          <button
            onClick={() => setExpandedResults({...expandedResults, analysis: !expandedResults.analysis})}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <span className="text-sm font-medium text-gray-900">▸ 需求分析结果</span>
            <svg
              className={`w-4 h-4 transition-transform ${expandedResults.analysis ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {expandedResults.analysis && (
            <div className="px-6 pb-4 text-sm text-gray-600">
              <p>目标受众：25-35岁职场人士</p>
              <p>传播目标：提升品牌认知度</p>
            </div>
          )}
        </div>
      )}

      {/* 4. 最终结果卡片 */}
      {results.length > 0 && (
        <div className="p-6 space-y-4">
          {results.map((result, index) => (
            <div key={result.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* 结果头部 */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">版本 {index + 1}</span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">推荐</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">刚刚</span>
              </div>

              {/* 结果内容 */}
              <div className="p-4">
                <div className="font-mono text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">
                  {result.content}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded hover:bg-gray-50 transition">
                    复制
                  </button>
                  <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded hover:bg-gray-50 transition">
                    优化
                  </button>
                  <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded hover:bg-gray-50 transition">
                    再生成
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}