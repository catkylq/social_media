'use client';

import { useState, useEffect } from 'react';

interface WorkflowStep {
  id: number;
  name: string;
  description: string;
  icon: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
  progress?: number;
}

interface WorkflowVisualizerProps {
  isActive: boolean;
  onComplete?: (results: any) => void;
}

export default function WorkflowVisualizer({ isActive, onComplete }: WorkflowVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      name: '需求分析',
      description: '分析用户输入，提取关键信息',
      icon: '🔍',
      status: 'pending'
    },
    {
      id: 2,
      name: '内容规划',
      description: '制定内容框架和结构',
      icon: '📋',
      status: 'pending'
    },
    {
      id: 3,
      name: '初稿生成',
      description: '基于规划生成初始内容',
      icon: '✍️',
      status: 'pending'
    },
    {
      id: 4,
      name: '扩展优化',
      description: '丰富内容细节和表达',
      icon: '🎨',
      status: 'pending'
    },
    {
      id: 5,
      name: '最终润色',
      description: '语言优化和格式调整',
      icon: '✨',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (!isActive) return;

    const runWorkflow = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // 更新当前步骤为处理中
        setSteps(prev => prev.map((step, idx) => 
          idx === i 
            ? { ...step, status: 'processing', progress: 0 }
            : step
        ));

        // 模拟进度更新
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setSteps(prev => prev.map((step, idx) => 
            idx === i 
              ? { ...step, progress }
              : step
          ));
        }

        // 模拟生成结果
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = generateStepResult(steps[i]);
        
        setSteps(prev => prev.map((step, idx) => 
          idx === i 
            ? { ...step, status: 'completed', result, progress: 100 }
            : step
        ));
      }

      // 完成后通知父组件
      if (onComplete) {
        onComplete({ success: true });
      }
    };

    runWorkflow();
  }, [isActive]);

  const generateStepResult = (step: WorkflowStep): string => {
    const results = {
      1: `主题：AI内容生成工具
目标受众：自媒体运营者、内容创作者
核心卖点：多平台支持、效率提升、智能优化
关键词：AI、效率、多平台、智能`,

      2: `结构框架：
1. 吸引力开头（问题/痛点）
2. 产品介绍（核心功能）
3. 使用体验（实际效果）
4. 数据支持（量化结果）
5. 行动号召（推荐/转化）

语气：友好、专业
长度：300-500字
风格：小红书种草风`,

      3: `【初稿】
发现一个超实用的AI工具！

作为内容创作者，每天写文案真的很累。直到我用了这个AI内容生成器...

核心功能：
• 多平台支持
• 智能优化
• 批量生成

真的能提升效率！`,

      4: `【扩展版】
✨ 发现一个超实用的AI工具！

🌟 作为一个内容创作者，我每天都要想各种文案，真的好累啊！直到我发现了这个AI内容生成器...

💡 它的功能太强大了：
• 支持小红书、抖音、微博、知乎等多平台
• 20+种语气随心选
• 还能根据网址自动提取内容
• 一键生成多个版本，选择困难症福音！

📝 最让我惊喜的是，它生成的内容质量真的很高，不是那种机械的AI味道，而是很有人情味的感觉。

🎯 推荐给所有做自媒体的姐妹们！真的能省很多时间～`,

      5: `✨【最终版本】今天分享一个超级实用的AI工具！

🌟 作为一个内容创作者，我每天都要想各种文案，真的好累啊！直到我发现了这个AI内容生成器...

💡 它的功能太强大了：
• 支持小红书、抖音、微博、知乎等多平台
• 20+种语气随心选
• 还能根据网址自动提取内容
• 一键生成多个版本，选择困难症福音！

📝 最让我惊喜的是，它生成的内容质量真的很高，不是那种机械的AI味道，而是很有人情味的感觉。

🎯 推荐给所有做自媒体的姐妹们！真的能省很多时间～

#AI工具 #内容创作 #自媒体运营 #效率提升`
    };

    return results[step.id as keyof typeof results] || '处理完成';
  };

  if (!isActive) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
      {/* 标题 */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Agentic 智能工作流
          </h3>
          <p className="text-sm text-gray-600">
            多阶段协同生成，确保内容高质量
          </p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 relative">
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-1 transition-all duration-500 ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-blue-500'
                      : 'bg-gray-200'
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* 步骤圆圈 */}
              <div className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                    step.status === 'completed'
                      ? 'bg-gradient-to-br from-green-400 to-blue-500 shadow-lg scale-110'
                      : step.status === 'processing'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110 animate-pulse'
                      : 'bg-white border-2 border-gray-300'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      step.status === 'processing'
                        ? 'text-blue-600'
                        : step.status === 'completed'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 当前步骤详情 */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{steps[currentStep]?.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900">
                {steps[currentStep]?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {steps[currentStep]?.description}
              </p>
            </div>
          </div>
          
          {/* 状态标识 */}
          {steps[currentStep]?.status === 'processing' && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">处理中</span>
            </div>
          )}
          {steps[currentStep]?.status === 'completed' && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm font-medium">已完成</span>
            </div>
          )}
        </div>

        {/* 进度条 */}
        {steps[currentStep]?.status === 'processing' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>进度</span>
              <span className="font-medium">{steps[currentStep]?.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${steps[currentStep]?.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 步骤结果 */}
        {steps[currentStep]?.result && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-700">阶段输出</h5>
              <button className="text-xs text-blue-600 hover:text-blue-700">
                展开详情 ↓
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {steps[currentStep]?.result}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* 整体进度 */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-gray-600">
          整体进度: {currentStep + 1} / {steps.length}
        </span>
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="font-medium text-gray-900">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
      </div>

      {/* 所有步骤完成提示 */}
      {currentStep === steps.length - 1 && steps[currentStep]?.status === 'completed' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <span className="text-xl">🎉</span>
            <span className="font-medium">
              工作流执行完成！内容已生成完毕。
            </span>
          </div>
        </div>
      )}
    </div>
  );
}