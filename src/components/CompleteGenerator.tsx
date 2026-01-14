'use client';

import { useState } from 'react';
import InputModule from './InputModule';
import ConfigPanel from './ConfigPanel';
import ResultDisplay from './ResultDisplay';
import WorkflowVisualizer from './WorkflowVisualizer';

type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface GeneratedContent {
  id: number;
  content: string;
  platform: string;
  createdAt: Date;
}

export default function CompleteGenerator() {
  const [platform, setPlatform] = useState<Platform>('小红书');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [useAgenticMode, setUseAgenticMode] = useState(false);

  // 模拟生成内容
  const handleGenerate = async () => {
    setIsLoading(true);
    setShowWorkflow(useAgenticMode);
    
    // 滚动到页面顶部，准备显示加载状态
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 如果使用 Agentic 模式，等待工作流完成
    if (useAgenticMode) {
      // 工作流会自动运行，等待约 12.5 秒（5个步骤，每个约2.5秒）
      await new Promise(resolve => setTimeout(resolve, 13000));
    } else {
      // 普通模式，简单延迟
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
    
    // 根据平台生成不同数量的模拟内容
    const count = 3;
    const mockResults: GeneratedContent[] = [];
    
    for (let i = 0; i < count; i++) {
      mockResults.push({
        id: Date.now() + i,
        content: generateMockContent(platform, i + 1),
        platform: platform,
        createdAt: new Date(),
      });
    }
    
    setResults(mockResults);
    setIsLoading(false);
    setShowWorkflow(false);
    
    // 生成完成后滚动到结果区域
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // 根据平台生成不同风格的模拟内容
  const generateMockContent = (platform: string, version: number) => {
    const contents = {
      '小红书': `✨【版本${version}】今天分享一个超级实用的AI工具！

🌟 作为一个内容创作者，我每天都要想各种文案，真的好累啊！直到我发现了这个AI内容生成器...

💡 它的功能太强大了：
• 支持小红书、抖音、微博、知乎等多平台
• 20+种语气随心选
• 还能根据网址自动提取内容
• 一键生成多个版本，选择困难症福音！

📝 最让我惊喜的是，它生成的内容质量真的很高，不是那种机械的AI味道，而是很有人情味的感觉。

🎯 而且针对不同平台有不同的优化策略：
小红书：种草风格，emoji丰富
抖音：简短有力，抓眼球
微博：热点话题，易传播
知乎：专业深度，有逻辑

💰 最重要的是，它帮我节省了超多时间！以前要花1小时的工作，现在20分钟就搞定了。

👭 推荐给所有做自媒体的姐妹们！真的能提升3倍效率～

#AI工具 #内容创作 #自媒体运营 #效率提升 #种草`,

      '抖音': `🔥【版本${version}】这个AI工具太牛了！

做自媒体的都知道
写文案真的很费脑子💭

但有了这个AI助手
一切都变简单了✨

只需3步：
1️⃣ 输入想法
2️⃣ 选择平台
3️⃣ 一键生成

✅ 多平台支持
✅ 智能优化
✅ 秒出文案

不信你试试
保证惊喜🎁

关注我，每天分享AI黑科技

#AI工具 #黑科技 #自媒体 #提效神器`,

      '微博': `【版本${version}】发现一个超级好用的AI内容生成工具！🚀

作为一个每天要发多条微博的人，这个工具简直是救星。

核心功能：
✓ 多平台适配（小红书/抖音/微博/知乎）
✓ 20+种语气可选
✓ URL内容智能提取
✓ 批量生成多版本

最重要的是生成的内容质量真的很高，完全不像机器写的。有专业的、有活泼的、有幽默的，想要什么风格都能搞定。

用了一个月，我的内容创作效率提升了300%，强烈推荐给需要频繁产出内容的朋友们！💯 

#AI工具推荐 #提高效率 #自媒体运营 #内容创作`,

      '知乎': `【版本${version}】深度体验：这款AI内容生成工具如何提升300%创作效率

## 一、为什么需要AI辅助创作？

作为一名全平台内容创作者，我每天需要在小红书、抖音、微博、知乎等平台发布内容。过去，这意味着：

- 为每个平台单独撰写文案
- 调整不同平台的内容风格
- 控制字数和排版格式
- 添加合适的话题标签

一天下来，至少需要3-4小时纯写作时间。

## 二、这款工具的核心优势

经过一个月的深度使用，我总结了以下亮点：

### 1. 多平台智能适配

工具内置了各大平台的内容特性：
- **小红书**：种草风格，emoji丰富，话题标签精准
- **抖音**：短小精悍，前3秒抓眼球，悬念式开头
- **微博**：热点话题，简洁有力，转发引导
- **知乎**：逻辑严谨，数据支持，深度分析

### 2. 20+种语气控制

从专业到幽默，从正式到休闲，覆盖所有内容场景。我特别喜欢"小红书种草"和"知乎专业讨论"这两种语气。

### 3. URL智能提取

这是最实用的功能。输入文章链接，AI自动提取核心内容并生成推广文案，准确率达90%以上。

### 4. 批量生成优化

一次可生成1-5个版本，每个版本风格略有不同，给了很大的选择空间。

## 三、实际效果数据

使用一个月后的数据对比：

**时间效率：**
- 过去：单平台内容需要30-45分钟
- 现在：多平台内容20分钟完成
- 效率提升：**300%**

**内容质量：**
- 互动率提升：**平均35%**
- 粉丝增长：**加速40%**
- 内容多样性：**显著提高**

## 四、使用建议

虽然AI生成的内容质量不错，但我仍建议：

1. **人工审核必不可少**：检查事实准确性和品牌调性
2. **适度修改优化**：加入个人经验和独特观点
3. **A/B测试**：多版本对比找到最优方案
4. **保持真实感**：避免过度依赖AI，保持个人风格

## 五、总结

对于需要频繁产出多平台内容的创作者来说，这款工具确实能显著提升效率。它不是要替代人工创作，而是作为一个智能助手，帮你完成重复性工作，让你有更多时间专注于创意和策略。

推荐指数：⭐⭐⭐⭐⭐（满分5星）

适用人群：自媒体运营者、品牌营销人员、内容创作者

---

以上是我的真实使用体验，希望对大家有帮助。`
    };
    
    return contents[platform as keyof typeof contents] || contents['小红书'];
  };

  const handleRegenerate = (id: number) => {
    console.log('重新生成:', id);
    // TODO: 实现重新生成单个结果的逻辑
  };

  const handleEdit = (id: number) => {
    console.log('编辑:', id);
    // TODO: 实现编辑功能
  };

  return (
    <>
      {/* 输入和配置区域 */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="space-y-6">
            <InputModule />
            
            <ConfigPanel 
              platform={platform}
              onPlatformChange={setPlatform}
            />

            {/* Agentic 模式开关 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Agentic 智能工作流
                    </h4>
                    <p className="text-sm text-gray-600">
                      多阶段协同生成，可视化展示每个步骤
                    </p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAgenticMode}
                    onChange={(e) => setUseAgenticMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                </label>
              </div>

              {useAgenticMode && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ 启用后将展示完整的 AI 工作流程，包括需求分析、内容规划、初稿生成、扩展优化、最终润色等 5 个阶段。
                  </p>
                </div>
              )}
            </div>

            {/* 生成按钮 */}
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? '⏳ 生成中...' : useAgenticMode ? '🤖 启动智能工作流' : '🚀 生成内容'}
            </button>
          </div>
        </div>

        {/* 工作流可视化 */}
        {showWorkflow && (
          <div className="p-8 pt-0">
            <WorkflowVisualizer 
              isActive={showWorkflow}
              onComplete={() => {
                console.log('工作流完成');
              }}
            />
          </div>
        )}

        {/* 结果展示区域 */}
        <div id="results-section">
          <ResultDisplay 
            isLoading={isLoading && !showWorkflow}
            results={results}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </>
  );
}