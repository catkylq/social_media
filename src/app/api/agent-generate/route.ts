import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type ValidatorIssueCode =
  | 'WORD_COUNT'
  | 'EMOJI'
  | 'HASHTAGS'
  | 'MUST_INCLUDE'
  | 'MUST_EXCLUDE'
  | 'FORBIDDEN_PHRASE'
  | 'PLATFORM_STRUCTURE';

interface ValidatorIssue {
  code: ValidatorIssueCode;
  message: string;
}

interface ValidationResult {
  pass: boolean;
  issues: ValidatorIssue[];
  metrics: Record<string, number>;
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

function getDynamicTemperature(creativity: string) {
  switch (creativity) {
    case '保守': return 0.3;
    case '创新': return 0.9;
    default: return 0.7;
  }
}

function splitCSV(input: string | null | undefined): string[] {
  if (!input) return [];
  return input
    .split(/[,\uFF0C]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function countChineseChars(text: string): number {
  return text.trim().length;
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[^\s#]{1,30}/g) || [];
  return matches.map((x) => x.trim());
}

function hasForbiddenPhrase(text: string): boolean {
  return /作为\s*AI/.test(text);
}

function containsEmojis(text: string): boolean {
  try {
    return /\p{Extended_Pictographic}/u.test(text);
  } catch {
    return false;
  }
}

function getPlatformStructure(platform: string) {
  if (platform.includes('小红书')) return `结构：
1. 强吸引开头
2. 场景或痛点
3. 3-5个价值点
4. 互动引导`;
  if (platform.includes('知乎')) return `结构：
1. 提出问题或观点
2. 分点论述（1、2、3）
3. 总结升华`;
  if (platform.includes('微博')) return `结构：
1. 引言
2. 主体分段
3. 总结`;
  return `结构清晰，逻辑完整。`;
}

function buildAdvancedSection(targetAudience: string, mustInclude: string, mustExclude: string): string {
  return [
    targetAudience?.trim() ? `目标受众：${targetAudience.trim()}` : null,
    mustInclude?.trim() ? `必须包含以下关键词（自然融入正文，不可强行堆砌）：${mustInclude.trim()}` : null,
    mustExclude?.trim() ? `禁止出现以下词汇：${mustExclude.trim()}` : null,
  ].filter(Boolean).join('\n');
}

function buildStage1Prompt(inputText: string, platform: string, tone: string, wordLimit: number, advancedSection: string) {
  return `你是资深自媒体内容策划顾问。
现在要从“素材”中提取信息，并结合用户参数，输出创作需求要点（用于后续规划）。

请输出以下内容（用中文要点即可）：
1) 素材关键信息（主题、痛点/卖点、关键事实）
2) 目标受众洞察（如果用户未提供，就从素材推断）
3) 适配 ${platform} 的内容重点（为什么要这么写）

用户参数：
平台：${platform}
语气：${tone}
字数：${wordLimit}字 ±10%
${advancedSection ? `高级要求：\n${advancedSection}` : ''}

素材：
${inputText}`;
}

function buildStage2Prompt(stage1Result: string, structure: string, useEmojis: boolean, useHashtags: boolean, advancedSection: string) {
  return `你是资深新媒体内容策划师。
请把“需求分析”转成可执行的写作规划，并输出清晰结构，给后续生成正文使用。

【要求输出格式】
A) 结构大纲（严格贴合平台结构）
B) 受众切入点（开头应如何抓住人）
C) 卖点/价值点清单（3-5个）
D) 要用/不要用元素（基于：emoji/hashtags + mustInclude/mustExclude）

约束（必须遵守）：
- 平台结构：${structure}
- Emoji规则：${useEmojis ? '允许适度使用' : '禁止使用'}
- 标签规则：${useHashtags ? '文末添加3-5个#标签' : '禁止添加标签'}
- 禁止出现“作为AI”等表述
- 高级要求：${advancedSection ? '已给出，必须落到规划里' : '无'}

需求分析：
${stage1Result}`;
}

function buildStage3Prompt(stage2Result: string, cleanedInput: string, platform: string, tone: string, wordLimit: number, structure: string, useEmojis: boolean, useHashtags: boolean, advancedSection: string) {
  return `你是专业新媒体内容创作专家。
请根据“内容规划”生成初稿。

要求：
- 平台：${platform}
- 语气：${tone}
- 字数：${wordLimit}字 ±10%
- 结构：${structure}
- Emoji：${useEmojis ? '允许适度使用' : '禁止使用'}
- 标签：${useHashtags ? '文末添加3-5个#标签' : '禁止添加标签'}
- 禁止出现“作为AI”等表述
- 必须满足高级要求（若有）：${advancedSection ? '是' : '否'}

素材：
${cleanedInput}

内容规划（必须遵循）：
${stage2Result}

只输出正文内容，不要包含任何前缀或说明。`;
}

function buildStage4Prompt(stage3Result: string, wordLimit: number, useEmojis: boolean, useHashtags: boolean, advancedSection: string) {
  return `你是资深新媒体编辑。
请把“初稿”扩写成更有传播力、更完整的版本，要求：
- 保持平台结构、语气、字数范围（${wordLimit}字 ±10%）
- 不要引入“作为AI”等表述
- Emoji规则不变：${useEmojis ? '允许适度使用' : '禁止使用'}
- 标签规则不变：${useHashtags ? '文末添加3-5个#标签' : '禁止添加标签'}
- 必须满足高级要求（若有）：
${advancedSection ? advancedSection : '（无）'}

初稿：
${stage3Result}

只输出正文内容，不要包含任何前缀。`;
}

function buildStage5Prompt(
  stage4Result: string,
  platform: string,
  tone: string,
  wordLimit: number,
  structure: string,
  useEmojis: boolean,
  useHashtags: boolean,
  advancedSection: string,
  improvementNotes?: string
) {
  const notes = improvementNotes?.trim()
    ? `\n需要修复以下问题（逐条修复，不可新增违禁）：\n${improvementNotes.trim()}\n`
    : '';

  return `你是专业的最终润色编辑。
请对以下内容进行最终语言统一、节奏优化与表达增强，要求：
- 平台：${platform}
- 语气：${tone}
- 字数：${wordLimit}字 ±10%
- 平台结构与论点完整性不变：${structure}
- Emoji规则不变：${useEmojis ? '允许适度使用' : '禁止使用'}
- 标签规则不变：${useHashtags ? '文末添加3-5个#标签' : '禁止添加标签'}
- 字数不达标时必须先删减/压缩到 ${wordLimit} 字 ±10% 范围内（优先满足字数约束）
- ${advancedSection ? `高级要求必须满足：\n${advancedSection}` : '无额外高级要求'}
- 禁止出现“作为AI”等表述

只输出正文内容，不要包含任何前缀。

待润色内容：
${stage4Result}${notes}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[agent-generate] Received request body:', JSON.stringify(body, null, 2));

    const {
      inputText,
      platform,
      tone,
      wordLimit,
      useHashtags,
      useEmojis,
      targetAudience,
      mustInclude,
      mustExclude,
      creativity,
      maxIterations = 2,
      targetScore = 85,
    } = body;

    if (!inputText?.trim()) {
      return NextResponse.json({ error: '缺少素材文本' }, { status: 400 });
    }

    const temperature = getDynamicTemperature(creativity);
    const structure = getPlatformStructure(platform);
    const advancedSection = buildAdvancedSection(targetAudience, mustInclude, mustExclude);
    const cleanedInput = String(inputText).slice(0, 3000);

    const mustIncludeList = splitCSV(mustInclude);
    const mustExcludeList = splitCSV(mustExclude);

    function validateGeneratedContent(content: string): ValidationResult {
      const issues: ValidatorIssue[] = [];
      const metrics: Record<string, number> = {};

      const len = countChineseChars(content);
      metrics.textLength = len;

      const lower = wordLimit * 0.9;
      const upper = wordLimit * 1.1;
      if (len < lower || len > upper) {
        issues.push({ code: 'WORD_COUNT', message: `字数不在范围内（期望 ${lower}-${upper}，实际约 ${len}）` });
      }

      metrics.hasForbiddenPhrase = hasForbiddenPhrase(content) ? 1 : 0;
      if (hasForbiddenPhrase(content)) {
        issues.push({ code: 'FORBIDDEN_PHRASE', message: '包含违禁表述：“作为AI”等' });
      }

      const emojiPresent = containsEmojis(content);
      metrics.emojiPresent = emojiPresent ? 1 : 0;
      if (!useEmojis && emojiPresent) {
        issues.push({ code: 'EMOJI', message: '检测到表情符号，但配置为禁止使用 Emoji' });
      }

      const hashtags = extractHashtags(content);
      metrics.hashtagCount = hashtags.length;
      if (useHashtags) {
        if (hashtags.length < 3 || hashtags.length > 5) {
          issues.push({ code: 'HASHTAGS', message: `话题标签数量不符合要求（期望 3-5 个，实际 ${hashtags.length} 个）` });
        }
      } else if (hashtags.length > 0) {
        issues.push({ code: 'HASHTAGS', message: '检测到话题标签，但配置为禁止添加 hashtags' });
      }

      if (mustIncludeList.length > 0) {
        const missing = mustIncludeList.filter((k) => !content.includes(k));
        if (missing.length > 0) {
          issues.push({ code: 'MUST_INCLUDE', message: `缺少必须包含的关键词：${missing.join('、')}` });
        }
      }

      if (mustExcludeList.length > 0) {
        const hit = mustExcludeList.filter((k) => content.includes(k));
        if (hit.length > 0) {
          issues.push({ code: 'MUST_EXCLUDE', message: `包含禁止出现的关键词：${hit.join('、')}` });
        }
      }

      const keywordHitCount = (() => {
        if (String(platform).includes('小红书')) {
          return ['痛点', '价值', '互动'].reduce((acc, kw) => acc + (content.includes(kw) ? 1 : 0), 0);
        }
        if (String(platform).includes('知乎')) {
          return ['观点', '论述', '总结', '升华'].reduce((acc, kw) => acc + (content.includes(kw) ? 1 : 0), 0);
        }
        if (String(platform).includes('微博')) {
          return ['引言', '主体', '总结'].reduce((acc, kw) => acc + (content.includes(kw) ? 1 : 0), 0);
        }
        return 0;
      })();

      metrics.platformKeywordHits = keywordHitCount;
      if (keywordHitCount > 0 && keywordHitCount < 2) {
        issues.push({ code: 'PLATFORM_STRUCTURE', message: '平台结构要点命中不足（建议补齐 hook/结构段落与总结/互动等关键要素）' });
      }

      return { pass: issues.length === 0, issues, metrics };
    }

    function decideAction(validation: ValidationResult): 'revise_stage5' | 'revise_stage2' {
      const hasStructureIssue = validation.issues.some((i) => i.code === 'PLATFORM_STRUCTURE');
      return hasStructureIssue ? 'revise_stage2' : 'revise_stage5';
    }

    function buildImprovementNotes(validation: ValidationResult, score: number | null): string {
      const lines = validation.issues.map((i) => `- ${i.message}`);
      const scoreLine = score != null ? `- 结合评分维度提升整体质量（当前 ${score}）` : null;
      return [...lines, scoreLine].filter(Boolean).join('\n');
    }

    async function scoreContent(content: string): Promise<number> {
      const scoringPrompt = `请对以下内容评分（0-100）。评分维度：平台匹配、语气匹配、字数控制、结构完整、吸引力。只返回数字。\n\n内容：${content}`;
      const scoreRaw = await callDeepSeek([{ role: 'system', content: scoringPrompt }], 0.2);
      return parseInt(scoreRaw.replace(/\D/g, '')) || 70;
    }

    function computeAdjustedScore(score: number, validation: ValidationResult): number {
      let penalty = 0;

      for (const issue of validation.issues) {
        switch (issue.code) {
          case 'FORBIDDEN_PHRASE':
            penalty += 1000;
            break;
          case 'EMOJI':
            penalty += 200;
            break;
          case 'HASHTAGS':
            penalty += 120;
            break;
          case 'MUST_INCLUDE':
          case 'MUST_EXCLUDE':
            penalty += 80;
            break;
          case 'WORD_COUNT': {
            const len = validation.metrics.textLength ?? 0;
            const ratio = Math.abs(len - wordLimit) / Math.max(1, wordLimit);
            penalty += 30 + Math.min(200, ratio * 200);
            break;
          }
          case 'PLATFORM_STRUCTURE':
            penalty += 60;
            break;
          default:
            penalty += 20;
        }
      }

      return score - penalty;
    }

    let stage1Result = '';
    let stage2Result = '';
    let stage3Result = '';
    let stage4Result = '';
    let stage5Result = '';

    let bestScore = -Infinity;
    let bestAdjustedScore = -Infinity;
    let bestPassScore = -Infinity;
    let bestStages: [string, string, string, string, string] | null = null;
    let bestPassStages: [string, string, string, string, string] | null = null;
    let iterationCount = 0;

    const traceIterations: Array<{
      iteration: number;
      action: 'revise_stage5' | 'revise_stage2';
      score: number;
      adjustedScore: number;
      pass: boolean;
      validation: ValidationResult;
    }> = [];

    let lastValidation: ValidationResult | null = null;
    let currentAction: 'revise_stage5' | 'revise_stage2' = 'revise_stage5';
    let lastScore: number | null = null;

    for (let iter = 0; iter <= maxIterations; iter++) {
      iterationCount = iter;

      if (!stage1Result) {
        stage1Result = await callDeepSeek(
          [{ role: 'system', content: buildStage1Prompt(cleanedInput, platform, tone, wordLimit, advancedSection) }],
          temperature
        );
      }

      if (!stage2Result || !stage3Result || !stage4Result || currentAction === 'revise_stage2') {
        const improvementNotesForPlan = lastValidation ? buildImprovementNotes(lastValidation, lastScore) : null;
        const stage2Prompt = `${buildStage2Prompt(stage1Result, structure, useEmojis, useHashtags, advancedSection)}${
          improvementNotesForPlan ? `\n\n反思反馈（需要改进）：\n${improvementNotesForPlan}` : ''
        }`;

        stage2Result = await callDeepSeek([{ role: 'system', content: stage2Prompt }], temperature);
        stage3Result = await callDeepSeek(
          [{ role: 'system', content: buildStage3Prompt(stage2Result, cleanedInput, platform, tone, wordLimit, structure, useEmojis, useHashtags, advancedSection) }],
          temperature
        );
        stage4Result = await callDeepSeek(
          [{ role: 'system', content: buildStage4Prompt(stage3Result, wordLimit, useEmojis, useHashtags, advancedSection) }],
          temperature
        );
      }

      const improvementNotesForStage5 = lastValidation ? buildImprovementNotes(lastValidation, null) : undefined;
      stage5Result = await callDeepSeek(
        [
          {
            role: 'system',
            content: buildStage5Prompt(
              stage4Result,
              platform,
              tone,
              wordLimit,
              structure,
              useEmojis,
              useHashtags,
              advancedSection,
              improvementNotesForStage5
            ),
          },
        ],
        temperature
      );

      const score = await scoreContent(stage5Result);
      const validation = validateGeneratedContent(stage5Result);
      const adjustedScore = computeAdjustedScore(score, validation);
      traceIterations.push({
        iteration: iter,
        action: currentAction,
        score,
        adjustedScore,
        pass: validation.pass,
        validation,
      });
      lastValidation = validation;
      lastScore = score;

      if (adjustedScore > bestAdjustedScore) {
        bestAdjustedScore = adjustedScore;
        bestScore = score;
        bestStages = [stage1Result, stage2Result, stage3Result, stage4Result, stage5Result];
      }

      if (validation.pass && score > bestPassScore) {
        bestPassScore = score;
        bestPassStages = [stage1Result, stage2Result, stage3Result, stage4Result, stage5Result];
      }

      if (validation.pass && score >= targetScore) {
        break;
      }

      currentAction = decideAction(validation);
    }

    const finalStages =
      (bestPassStages ?? bestStages) ?? [stage1Result, stage2Result, stage3Result, stage4Result, stage5Result];
    if (bestPassStages) bestScore = bestPassScore;

    console.log('[agent-generate] run trace iterations:', traceIterations.map((t) => ({
      iteration: t.iteration,
      action: t.action,
      score: t.score,
      adjustedScore: t.adjustedScore,
      pass: t.pass,
      issues: t.validation.issues.map((i) => i.code),
    })));

    return NextResponse.json({
      mode: 'run',
      results: [
        {
          id: Date.now(),
          content: finalStages[4],
          platform,
          createdAt: new Date(),
          score: bestScore,
          iterationCount,
        },
      ],
      stages: [
        { name: '需求分析', content: finalStages[0] },
        { name: '内容规划', content: finalStages[1] },
        { name: '初稿生成', content: finalStages[2] },
        { name: '扩展优化', content: finalStages[3] },
        { name: '最终润色', content: finalStages[4] },
      ],
      trace: {
        iterations: traceIterations,
        targetScore,
      },
    });
  } catch (error: any) {
    console.error('[agent-generate] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Agent generation failed' },
      { status: 500 }
    );
  }
}