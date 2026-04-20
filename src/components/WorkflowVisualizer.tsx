'use client';

interface WorkflowStage {
  content: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

interface WorkflowVisualizerProps {
  isActive: boolean;
  stages: WorkflowStage[];
  currentStage: number;
  status: 'idle' | 'generating' | 'waitingConfirm';
  onConfirm: () => void;
  onRegenerate: () => void;
}

export default function WorkflowVisualizer({
  isActive,
  stages,
  currentStage,
  status,
  onConfirm,
  onRegenerate,
}: WorkflowVisualizerProps) {
  const stepNames = ['需求分析', '内容规划', '初稿生成', '扩展优化', '最终润色'];
  const stepIcons = ['🔍', '📋', '✍️', '🎨', '✨'];

  const getStepStatus = (index: number): 'pending' | 'processing' | 'completed' | 'error' => {
    if (!stages[index]) return 'pending';
    if (stages[index].status === 'completed') return 'completed';
    if (stages[index].status === 'error') return 'error';
    if (stages[index].status === 'generating') return 'processing';
    return 'pending';
  };

  if (!isActive) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agentic 智能工作流</h3>
          <p className="text-sm text-gray-600">多阶段协同生成，确保内容高质量</p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {stepNames.map((name, idx) => {
            const stepStatus = getStepStatus(idx);
            const isActiveStep = idx + 1 === currentStage;
            const isCompleted = stepStatus === 'completed';
            const isProcessing = stepStatus === 'processing';
            return (
              <div key={idx} className="flex-1 relative">
                {idx < stepNames.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-1 transition-all duration-500 ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-200'
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}
                <div className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-blue-500 shadow-lg scale-110'
                        : isProcessing
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110 animate-pulse'
                          : stepStatus === 'error'
                            ? 'bg-red-500 text-white'
                            : 'bg-white border-2 border-gray-300'
                    }`}
                  >
                    {isCompleted ? '✓' : isProcessing ? stepIcons[idx] : stepStatus === 'error' ? '⚠️' : stepIcons[idx]}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${
                    isCompleted ? 'text-green-600' : isProcessing ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 当前阶段详情 */}
      {currentStage <= stepNames.length && stages[currentStage - 1] && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{stepIcons[currentStage - 1]}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{stepNames[currentStage - 1]}</h4>
                <p className="text-sm text-gray-600">
                  {currentStage === 1 && '从素材提取关键信息、受众洞察与平台适配要点'}
                  {currentStage === 2 && '将需求分析转为写作大纲、卖点清单与元素约束'}
                  {currentStage === 3 && '根据规划生成初稿正文'}
                  {currentStage === 4 && '扩写、增强表达，补全结构要点'}
                  {currentStage === 5 && '语言与节奏统一，并进行评分收敛'}
                </p>
              </div>
            </div>
            {status === 'generating' && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium">生成中...</span>
              </div>
            )}
            {status === 'waitingConfirm' && (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <span className="text-sm font-medium">待确认</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">阶段输出</h5>
            {stages[currentStage - 1].content ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {stages[currentStage - 1].content}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-500">
                {status === 'generating' ? '生成中...' : '等待生成'}
              </div>
            )}
          </div>

          {status === 'waitingConfirm' && stages[currentStage - 1].status === 'completed' && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={onRegenerate}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                ⚠️ 不满意，重新生成
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                ✓ 满意，进入下一阶段
              </button>
            </div>
          )}
        </div>
      )}

      {/* <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-gray-600">整体进度: {currentStage} / {stepNames.length}</span>
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${Math.round((currentStage / stepNames.length) * 100)}%` }}
            />
          </div>
          <span className="font-medium text-gray-900">{Math.round((currentStage / stepNames.length) * 100)}%</span>
        </div>
      </div> */}
    </div>
  );
}
