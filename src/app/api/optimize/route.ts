import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface OptimizeRequest {
  originalContent: string;
  userFeedback: string;
  platform?: string;
  tone?: string;
  wordLimit?: number;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callDeepSeek(messages: Message[], temperature = 0.7): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API error: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function buildOptimizeSystemPrompt(
  platform: string = '小红书',
  tone: string = '专业',
  wordLimit: number = 300
): string {
  return `你是专业的新媒体内容优化专家。

你的任务是：根据用户的反馈，对已有内容进行智能优化。

【优化原则】
1. 严格遵循用户的修改要求
2. 保持内容的核心信息不变
3. 优化表达方式，提升可读性和吸引力
4. 适配目标平台（${platform}）的风格特点
5. 保持语言流畅自然，避免生硬堆砌

【语气风格】
当前内容风格：${tone}
优化时请保持与 ${tone} 风格一致

【字数控制】
目标字数：${wordLimit}字 ±15%
如果用户要求缩短，保持核心信息完整的前提下精简
如果用户要求扩展，增加有价值的内容而非废话

【输出要求】
- 只输出优化后的内容正文，不要添加任何前缀说明
- 如果用户反馈涉及多个修改点，按重要性依次处理
- 如果用户只是确认或鼓励，保持内容不变或做小幅优化`;
}

function buildUserPrompt(
  originalContent: string,
  userFeedback: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): string {
  let contextSection = '';

  if (conversationHistory && conversationHistory.length > 1) {
    const recentHistory = conversationHistory.slice(-6);
    contextSection = `【对话历史摘要】
最近的优化对话：
${recentHistory.map((msg, i) => {
  const role = msg.role === 'user' ? '用户' : 'AI';
  return `[${role}] ${msg.content}`;
}).join('\n')}

请注意之前的优化方向，确保本次优化与历史优化保持一致性。`;
  }

  return `【原始内容】
${originalContent}

${contextSection}

【用户反馈】
${userFeedback}

请根据用户反馈优化上述内容。`;
}

function detectOptimizationType(feedback: string): string[] {
  const types: string[] = [];

  if (/友好|温暖|亲切|随和|轻松/i.test(feedback)) {
    types.push('friendly');
  }
  if (/专业|正式|严谨/i.test(feedback)) {
    types.push('professional');
  }
  if (/数据|统计|案例|证据/i.test(feedback)) {
    types.push('data_support');
  }
  if (/emoji|表情|图标|符号/i.test(feedback)) {
    types.push('emoji');
  }
  if (/缩短|精简|简短|压缩|更短/i.test(feedback)) {
    types.push('shorten');
  }
  if (/延长|扩展|详细|丰富/i.test(feedback)) {
    types.push('expand');
  }
  if (/突出|强调|重点|亮点/i.test(feedback)) {
    types.push('highlight');
  }
  if (/行动|号召|呼吁|引导/i.test(feedback)) {
    types.push('cta');
  }
  if (/幽默|有趣|活泼|俏皮/i.test(feedback)) {
    types.push('humor');
  }
  if (/故事|叙述|讲述/i.test(feedback)) {
    types.push('storytelling');
  }

  return types.length > 0 ? types : ['general'];
}

export async function POST(req: NextRequest) {
  try {
    const body: OptimizeRequest = await req.json();
    const {
      originalContent,
      userFeedback,
      platform = '小红书',
      tone = '专业',
      wordLimit = 300,
      conversationHistory,
    } = body;

    if (!originalContent?.trim()) {
      return NextResponse.json(
        { error: '缺少原始内容' },
        { status: 400 }
      );
    }

    if (!userFeedback?.trim()) {
      return NextResponse.json(
        { error: '缺少用户反馈' },
        { status: 400 }
      );
    }

    const optimizationTypes = detectOptimizationType(userFeedback);
    const systemPrompt = buildOptimizeSystemPrompt(platform, tone, wordLimit);
    const userPrompt = buildUserPrompt(originalContent, userFeedback, conversationHistory);

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const optimizedContent = await callDeepSeek(messages, 0.7);

    return NextResponse.json({
      success: true,
      originalContent,
      userFeedback,
      optimizedContent,
      optimizationTypes,
      metadata: {
        platform,
        tone,
        targetWordLimit: wordLimit,
        actualLength: optimizedContent.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[api/optimize] Error:', error);

    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API 配置错误，请检查 DeepSeek API Key 是否正确设置' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || '优化失败，请稍后重试' },
      { status: 500 }
    );
  }
}
