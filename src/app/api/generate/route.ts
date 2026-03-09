
// import { NextResponse } from 'next/server';

// const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
// const TARGET_SCORE = 85;
// const MAX_ITERATION = 2;

// async function callDeepSeek(messages: any[], temperature = 0.7) {
//   const response = await fetch(DEEPSEEK_API_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: 'deepseek-chat',
//       messages,
//       temperature,
//     }),
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(errText);
//   }

//   const data = await response.json();
//   return data.choices?.[0]?.message?.content ?? '';
// }

// // 平台结构模板
// function getPlatformStructure(platform: string) {
//   if (platform.includes('小红书')) {
//     return `
// 结构：
// 1. 强吸引开头
// 2. 场景或痛点
// 3. 3-5个价值点
// 4. 互动引导
// `;
//   }

//   if (platform.includes('知乎')) {
//     return `
// 结构：
// 1. 提出问题或观点
// 2. 分点论述（1、2、3）
// 3. 总结升华
// `;
//   }

//   if (platform.includes('公众号')) {
//     return `
// 结构：
// 1. 引言
// 2. 主体分段
// 3. 总结
// `;
//   }

//   return `结构清晰，逻辑完整。`;
// }

// export async function POST(req: Request) {
//   try {
//     const {
//       inputText,
//       platform,
//       tone,
//       wordLimit,
//       generateCount,
//       useHashtags,
//       useEmojis,
//     } = await req.json();

//     if (!inputText) {
//       return NextResponse.json(
//         { error: 'inputText is required' },
//         { status: 400 }
//       );
//     }

//     const finalPlatform = platform || '通用平台';
//     const finalTone = tone || '专业';
//     const finalWordLimit = wordLimit || 300;
//     const finalGenerateCount = generateCount || 1;

//     const structure = getPlatformStructure(finalPlatform);

//     // =========================
//     // 第一阶段：结构化生成
//     // =========================
//     const generationPrompt = `
// 你是专业新媒体内容创作专家。

// 生成 ${finalGenerateCount} 条内容。

// 要求：
// 平台：${finalPlatform}
// 语气：${finalTone}
// 字数：${finalWordLimit}字 ±10%
// ${structure}

// 表达要求：
// - 语言自然
// - 有传播力
// - 禁止出现“作为AI”等表述

// Emoji：
// ${useEmojis ? '允许适度使用' : '禁止使用'}

// 标签：
// ${useHashtags ? '文末添加3-5个#标签' : '禁止添加标签'}

// 素材：
// ${inputText}

// 输出格式：
// ### 内容1
// 正文

// ### 内容2
// 正文
// `;

//     const rawGenerated = await callDeepSeek([
//       { role: 'system', content: generationPrompt },
//     ]);

//     const splitResults = rawGenerated
//       .split(/### 内容\d+/)
//       .map((item: string) => item.trim())
//       .filter((item: string) => item.length > 0);

//     // =========================
//     // 第二阶段：逐条评分 + 迭代优化
//     // =========================
//     const optimizedResults = [];

//     for (let i = 0; i < splitResults.length; i++) {
//       let currentContent = splitResults[i];
//       let currentScore = 0;
//       let round = 0;

//       while (round <= MAX_ITERATION) {
//         // 评分
//         const scoringPrompt = `
// 请对以下内容评分（0-100）。

// 评分维度：
// - 平台匹配
// - 语气匹配
// - 字数控制
// - 结构完整
// - 吸引力

// 只返回数字。

// 内容：
// ${currentContent}
// `;

//         const scoreRaw = await callDeepSeek([
//           { role: 'system', content: scoringPrompt },
//         ], 0.2);

//         const parsedScore =
//           parseInt(scoreRaw.replace(/\D/g, '')) || 70;

//         currentScore = parsedScore;

//         if (currentScore >= TARGET_SCORE) break;

//         // 优化
//         const refinePrompt = `
// 以下内容评分 ${currentScore}。
// 请优化到 90 分以上。

// 必须保持：
// 平台：${finalPlatform}
// 语气：${finalTone}
// 字数：${finalWordLimit} ±10%
// Emoji规则不变
// 标签规则不变

// 原内容：
// ${currentContent}
// `;

//         const refined = await callDeepSeek([
//           { role: 'system', content: refinePrompt },
//         ]);

//         currentContent = refined;
//         round++;
//       }

//       optimizedResults.push({
//         id: Date.now() + i,
//         content: currentContent,
//         platform: finalPlatform,
//         createdAt: new Date(),
//       });
//     }

//     // =========================
//     // 返回最终结果（数量=用户选择）
//     // =========================
//     return NextResponse.json({
//       results: optimizedResults,
//     });

//   } catch (error: any) {
//     console.error('DeepSeek API Error:', error);
//     return NextResponse.json(
//       { error: 'AI generation failed' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const TARGET_SCORE = 85;
const MAX_ITERATION = 2;

async function callDeepSeek(messages: any[], temperature = 0.7) {
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

// 平台结构模板
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

export async function POST(req: Request) {
  try {
    const {
      inputText,
      platform,
      tone,
      wordLimit,
      generateCount,
      useHashtags,
      useEmojis,
      // 高级选项（均为可选）
      targetAudience,
      mustInclude,
      mustExclude,
    } = await req.json();

    if (!inputText) {
      return NextResponse.json(
        { error: 'inputText is required' },
        { status: 400 }
      );
    }

    const finalPlatform = platform || '通用平台';
    const finalTone = tone || '专业';
    const finalWordLimit = wordLimit || 300;
    const finalGenerateCount = generateCount || 1;

    const structure = getPlatformStructure(finalPlatform);

    // ── 高级选项拼接（只有用户填写了才加入 prompt）──────
    const advancedSection = [
      targetAudience?.trim()
        ? `目标受众：${targetAudience.trim()}`
        : null,
      mustInclude?.trim()
        ? `必须包含以下关键词（自然融入正文，不可强行堆砌）：${mustInclude.trim()}`
        : null,
      mustExclude?.trim()
        ? `禁止出现以下词汇：${mustExclude.trim()}`
        : null,
    ]
      .filter(Boolean)
      .join('\n');

    // =========================
    // 第一阶段：结构化生成
    // =========================
    const generationPrompt = `
你是专业新媒体内容创作专家。

生成 ${finalGenerateCount} 条内容。

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
${inputText}

输出格式：
### 内容1
正文

### 内容2
正文
`;

    const rawGenerated = await callDeepSeek([
      { role: 'system', content: generationPrompt },
    ]);

    const splitResults = rawGenerated
      .split(/### 内容\d+/)
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);

    // =========================
    // 第二阶段：逐条评分 + 迭代优化
    // =========================
    const optimizedResults = [];

    for (let i = 0; i < splitResults.length; i++) {
      let currentContent = splitResults[i];
      let currentScore = 0;
      let round = 0;

      while (round <= MAX_ITERATION) {
        // 评分
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

        const scoreRaw = await callDeepSeek([
          { role: 'system', content: scoringPrompt },
        ], 0.2);

        const parsedScore =
          parseInt(scoreRaw.replace(/\D/g, '')) || 70;

        currentScore = parsedScore;

        if (currentScore >= TARGET_SCORE) break;

        // 优化
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

        const refined = await callDeepSeek([
          { role: 'system', content: refinePrompt },
        ]);

        currentContent = refined;
        round++;
      }

      optimizedResults.push({
        id: Date.now() + i,
        content: currentContent,
        platform: finalPlatform,
        createdAt: new Date(),
      });
    }

    // =========================
    // 返回最终结果（数量=用户选择）
    // =========================
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