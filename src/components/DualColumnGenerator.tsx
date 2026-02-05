'use client';

import { useState } from 'react';
import LeftInputPanel from './LeftInputPanel';
import RightOutputPanel from './RightOutputPanel';
import { useToast } from './ToastNotification';

type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface GeneratedContent {
  id: number;
  content: string;
  platform: string;
}

export default function DualColumnGenerator() {
  const [platform, setPlatform] = useState<Platform>('小红书');
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const { showToast, ToastContainer } = useToast();

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setShowWorkflow(true);
      
      // 模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 模拟结果
      const mockResults: GeneratedContent[] = [
        {
          id: 1,
          content: `【${platform}内容示例 - 推荐版本】

这是为您生成的第一版内容。
针对${platform}平台特性进行了优化。

包含合适的语气和风格。
适合目标受众阅读。

#话题标签 #AI内容生成`,
          platform
        },
        {
          id: 2,
          content: `【${platform}内容示例 - 版本2】

这是第二个生成版本。
提供了不同的表达角度。

同样经过精心优化。`,
          platform
        }
      ];
      
      setResults(mockResults);
      setShowWorkflow(false);
      setIsLoading(false);
      showToast('内容生成成功', 'success');
      
    } catch (error) {
      setIsLoading(false);
      setShowWorkflow(false);
      showToast('生成失败，请重试', 'error');
    }
  };

  return (
    <>
      <ToastContainer />
      
      {/* 左右双栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入 & 配置区 */}
        <LeftInputPanel
          onGenerate={handleGenerate}
          isLoading={isLoading}
          platform={platform}
          onPlatformChange={setPlatform}
        />

        {/* 右侧：Agent 工作流 & 输出区 */}
        <RightOutputPanel
          isLoading={isLoading}
          showWorkflow={showWorkflow}
          results={results}
        />
      </div>
    </>
  );
}