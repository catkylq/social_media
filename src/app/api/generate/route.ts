import { NextRequest, NextResponse } from 'next/server';
import * as pdfParse from 'pdf-parse';          // 修复：使用命名空间导入
import mammoth from 'mammoth';                   // 默认导入，无类型问题

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const TARGET_SCORE = 85;
const MAX_ITERATION = 2;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callDeepSeek(messages: Message[], temperature = 0.7) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function getPlatformStructure(platform: string) {
  if (platform.includes('小红书')) {
    return `
结构：
1. 强吸引开头
2. 场景或痛点
3. 3-5个价值点
4. 互动引导
`;
  }
  if (platform.includes('知乎')) {
    return `
结构：
1. 提出问题或观点
2. 分点论述（1、2、3）
3. 总结升华
`;
  }
  if (platform.includes('微博')) {
    return `
结构：
1. 引言
2. 主体分段
3. 总结
`;
  }
  return `结构清晰，逻辑完整。`;
}

// ================== 文件文本提取（修复类型错误） ==================
async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type;

  if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  } else if (mimeType === 'application/pdf') {
    try {
      // 关键修复：使用类型断言，明确 pdfParse 是一个接受 Buffer 并返回 Promise<{ text: string }> 的函数
      // const data = await (pdfParse as (buffer: Buffer) => Promise<{ text: string }>)(buffer);
      const data = await (pdfParse as unknown as (buffer: Buffer) => Promise<{ text: string }>)(buffer);
      return data.text;
    } catch (err) {
      throw new Error(`PDF 解析失败: ${err}`);
    }
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (err) {
      throw new Error(`Word 文档解析失败: ${err}`);
    }
  } else {
    throw new Error(`不支持的文件类型: ${mimeType}`);
  }
}

// 文本清洗/截断
function cleanText(text: string, maxLength: number): string {
  let cleaned = text.replace(/\n\s*\n/g, '\n\n').trim();
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength) + '...';
  }
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let inputText = '';
    // 声明所有需要的参数（包括 creativity）
    let platform: string = '通用平台';
    let tone: string = '专业';
    let wordLimit: number = 300;
    let generateCount: number = 1;
    let useHashtags: boolean = true;
    let useEmojis: boolean = true;
    let targetAudience: string = '';
    let mustInclude: string = '';
    let mustExclude: string = '';
    let creativity: string = '平衡';  // 默认值

    if (contentType.includes('multipart/form-data')) {
      // ---------- 文件上传模式 ----------
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const paramsStr = formData.get('params') as string | null;

      if (!file) {
        return NextResponse.json({ error: '未提供文件' }, { status: 400 });
      }
      if (!paramsStr) {
        return NextResponse.json({ error: '缺少参数' }, { status: 400 });
      }

      let params: any;
      try {
        params = JSON.parse(paramsStr);
      } catch {
        return NextResponse.json({ error: '参数格式错误' }, { status: 400 });
      }

      // 从 params 中提取所有需要的字段（包括 creativity）
      platform = params.platform || '通用平台';
      tone = params.tone || '专业';
      wordLimit = params.wordLimit || 300;
      generateCount = params.generateCount || 1;
      useHashtags = params.useHashtags !== false;
      useEmojis = params.useEmojis !== false;
      targetAudience = params.targetAudience || '';
      mustInclude = params.mustInclude || '';
      mustExclude = params.mustExclude || '';
      creativity = params.creativity || '平衡';

      try {
        inputText = await extractTextFromFile(file);
      } catch (err: any) {
        return NextResponse.json({ error: `文件解析失败: ${err.message}` }, { status: 400 });
      }
    } else if (contentType.includes('application/json')) {
      // ---------- 原有 JSON 模式 ----------
      const body = await req.json();
      inputText = body.inputText || '';
      platform = body.platform || '通用平台';
      tone = body.tone || '专业';
      wordLimit = body.wordLimit || 300;
      generateCount = body.generateCount || 1;
      useHashtags = body.useHashtags !== false;
      useEmojis = body.useEmojis !== false;
      targetAudience = body.targetAudience || '';
      mustInclude = body.mustInclude || '';
      mustExclude = body.mustExclude || '';
      creativity = body.creativity || '平衡';
    } else {
      return NextResponse.json({ error: '不支持的 Content-Type' }, { status: 400 });
    }

    if (!inputText.trim()) {
      return NextResponse.json({ error: '输入内容为空' }, { status: 400 });
    }

    // ---------- 以下为生成逻辑，保持不变 ----------
    const finalPlatform = platform;
    const finalTone = tone;
    const finalWordLimit = wordLimit;
    const finalGenerateCount = generateCount;

    const structure = getPlatformStructure(finalPlatform);

    const advancedSection = [
      targetAudience?.trim() ? `目标受众：${targetAudience.trim()}` : null,
      mustInclude?.trim() ? `必须包含以下关键词（自然融入正文，不可强行堆砌）：${mustInclude.trim()}` : null,
      mustExclude?.trim() ? `禁止出现以下词汇：${mustExclude.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const cleanedInput = cleanText(inputText, 3000);

    const contentPromises = Array.from({ length: finalGenerateCount }).map(async (_, index) => {
      // 根据 creativity 动态计算 temperature（用于初始生成和优化）
      let dynamicTemperature: number;
      switch (creativity) {
        case '保守':
          dynamicTemperature = 0.3;
          break;
        case '创新':
          dynamicTemperature = 0.9;
          break;
        case '平衡':
        default:
          dynamicTemperature = 0.7;
          break;
      }

      const generationPrompt = `
你是专业新媒体内容创作专家。

生成 1 条内容（第 ${index + 1} 条）。

要求：
平台：${finalPlatform}
语气：${finalTone}
字数：${finalWordLimit}字 ±10%
${structure}

表达要求：
- 语言自然
- 有传播力
- 禁止出现"作为AI"等表述

Emoji：
${useEmojis ? '允许适度使用' : '禁止使用'}

标签：
${useHashtags ? '文末添加3-5个#标签' : '禁止添加标签'}
${advancedSection ? `\n高级要求：\n${advancedSection}` : ''}

素材：
${cleanedInput}

只输出正文内容，不要包含任何前缀。
`;

      // 初始生成使用动态温度
      let currentContent = await callDeepSeek([
        { role: 'system', content: generationPrompt },
      ], dynamicTemperature);

      let currentScore = 0;
      let round = 0;

      while (round <= MAX_ITERATION) {
        const scoringPrompt = `
请对以下内容评分（0-100）。

评分维度：
- 平台匹配
- 语气匹配
- 字数控制
- 结构完整
- 吸引力

只返回数字。

内容：
${currentContent}
`;

        // 评分保持低温度，保证稳定性
        const scoreRaw = await callDeepSeek([
          { role: 'system', content: scoringPrompt },
        ], 0.2);

        const parsedScore = parseInt(scoreRaw.replace(/\D/g, '')) || 70;
        currentScore = parsedScore;

        if (currentScore >= TARGET_SCORE) break;

        const refinePrompt = `
以下内容评分 ${currentScore}。
请优化到 90 分以上。

必须保持：
平台：${finalPlatform}
语气：${finalTone}
字数：${finalWordLimit} ±10%
Emoji规则不变
标签规则不变
${advancedSection ? `\n高级要求必须满足：\n${advancedSection}` : ''}

原内容：
${currentContent}
`;

        // 优化阶段也使用相同的动态温度（与用户选择一致）
        const refined = await callDeepSeek([
          { role: 'system', content: refinePrompt },
        ], dynamicTemperature);

        currentContent = refined;
        round++;
      }

      return {
        id: Date.now() + index,
        content: currentContent,
        platform: finalPlatform,
        createdAt: new Date(),
        score: currentScore,
        iterationCount: round,
      };
    });

    const optimizedResults = await Promise.all(contentPromises);

    return NextResponse.json({
      results: optimizedResults,
    });

  } catch (error: any) {
    console.error('DeepSeek API Error:', error);
    return NextResponse.json(
      { error: 'AI generation failed' },
      { status: 500 }
    );
  }
}