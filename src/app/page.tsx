'use client';

import { useEffect, useState, useCallback } from 'react';
import FormPanel from '../components/FormPanel';
import ResultDisplay from '../components/ResultDisplay';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import { useToast } from '../components/ToastNotification';
import ErrorBoundary from '../components/ErrorBoundary';
import type { HistoryItem } from '../components/HistoryPanel';

type Platform = '小红书' | '抖音' | '微博' | '知乎';

interface GeneratedContent {
  id: number;
  content: string;
  platform: string;
  createdAt: Date;
  score?: number;
}

interface AgentStage {
  content: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

// 平台图标数组（完整保留您提供的四个平台 SVG）
const PLATFORM_ICONS = [
  {
    label: '小红书',
    bg: 'transparent',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FF2741"></path>
        <path d="M780.288 487.424h26.112c4.096-38.912 2.048-40.96-26.112-36.352v36.352z m37.376 109.568h53.248c0-16.384 0.512-31.232 0-46.08-0.512-9.728-7.168-15.36-18.432-15.36-23.552-0.512-47.104 0-72.192 0v101.376h-54.784v-101.376H670.72v-47.104h53.248V450.56c-11.264-0.512-23.04-1.024-34.816-1.536v-46.592h34.816c1.024-5.632 1.536-10.24 2.56-15.36h52.224c1.024 4.608 1.536 8.704 2.56 14.336 26.112 0 55.808 0.512 68.608 22.528 10.752 18.432 11.776 41.472 17.408 64 0.512 0 5.12 0 9.216 0.512 29.184 2.56 47.616 18.432 49.152 43.52 1.024 22.016 1.024 43.52 0 65.536-1.536 26.112-23.04 40.448-56.832 39.936-32.256-0.512-49.664-14.336-51.2-40.448z m-200.192-6.656h52.224v46.08H479.232c9.216-15.872 17.92-30.72 27.136-46.592h53.248V449.536h-33.28v-46.592h124.416v46.08h-33.28v141.312zM432.64 497.664c-12.8-1.024-23.552-1.024-33.792-3.072-13.824-2.048-19.456-10.752-13.824-21.504 14.848-27.648 30.208-54.784 45.568-82.432 1.536-2.56 7.168-4.096 10.752-4.096 14.336-0.512 28.16 0 45.056 0-12.8 23.04-25.088 45.056-37.376 67.072l3.584 2.56c18.432-12.8 39.424-4.096 62.976-7.68-16.896 29.696-32.256 56.832-49.152 86.016 13.312 1.024 22.528 1.024 34.304 2.048-6.656 12.288-13.312 23.552-20.48 34.816-1.024 2.048-5.632 3.584-8.192 3.584-16.896 0-33.792 1.024-50.688-0.512-18.432-1.536-24.576-10.752-17.408-25.6 8.704-16.896 18.432-33.28 28.672-51.2M205.824 387.072h54.272c0.512 2.048 1.024 4.608 1.024 6.656V593.92c0 29.696-19.456 45.056-51.2 43.008-23.04-1.536-34.816-12.288-39.936-38.4 6.144 0 11.776-0.512 17.408-0.512h17.92c0.512 0 0.512-210.944 0.512-210.944zM114.176 450.048h56.32c-11.264 55.808 1.536 114.176-42.496 166.4-10.752-17.408-19.968-32.768-29.184-48.64-1.024-1.536-1.024-3.584-1.024-5.632 5.632-36.864 10.752-73.728 16.384-112.128m222.208 165.888c-41.472-51.2-30.208-109.568-39.936-165.888h55.296l7.68 82.944c0 1.536-0.512 3.02 0 4.608 13.824 29.696-7.68 51.712-23.04 78.336m28.16 21.504c11.264-18.432 18.944-32.256 27.648-45.568 1.024-2.048 5.12-4.096 7.68-4.096 12.8 0.512 25.6 2.048 38.4 2.56 12.8 0.512 25.6 0 40.448 0-8.704 15.36-16.896 28.672-25.088 42.496-1.536 2.048-5.12 4.608-7.68 4.608H364.544m506.88-188.928c0-9.216-1.024-17.92 0-26.624 1.536-12.288 14.336-20.992 28.16-19.968 13.312 1.024 24.064 10.24 25.6 22.016 1.024 11.776-8.704 23.552-23.04 24.576-9.728 0.512-19.968 0-30.72 0" fill="#FFFFFF"></path>
      </svg>
    )
  },
  {
    label: '抖音',
    bg: 'bg-black',
    icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  },
  {
    label: '微博',
    bg: 'transparent',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M851.4 590.193c-22.196-66.233-90.385-90.422-105.912-91.863-15.523-1.442-29.593-9.94-19.295-27.505 10.302-17.566 29.304-68.684-7.248-104.681-36.564-36.14-116.512-22.462-173.094 0.866-56.434 23.327-53.39 7.055-51.65-8.925 1.89-16.848 32.355-111.02-60.791-122.395C311.395 220.86 154.85 370.754 99.572 457.15 16 587.607 29.208 675.873 29.208 675.873h0.58c10.009 121.819 190.787 218.869 412.328 218.869 190.5 0 350.961-71.853 398.402-169.478 0 0 0.143-0.433 0.575-1.156 4.938-10.506 8.71-21.168 11.035-32.254 6.668-26.205 11.755-64.215-0.728-101.66z m-436.7 251.27c-157.71 0-285.674-84.095-285.674-187.768 0-103.671 127.82-187.76 285.674-187.76 157.705 0 285.673 84.089 285.673 187.76 0 103.815-127.968 187.768-285.673 187.768z" fill="#E71F19"></path>
        <path d="M803.096 425.327c2.896 1.298 5.945 1.869 8.994 1.869 8.993 0 17.7-5.328 21.323-14.112 5.95-13.964 8.993-28.793 8.993-44.205 0-62.488-51.208-113.321-114.181-113.321-15.379 0-30.32 3.022-44.396 8.926-11.755 4.896-17.263 18.432-12.335 30.24 4.933 11.662 18.572 17.134 30.465 12.238 8.419-3.46 17.268-5.33 26.41-5.33 37.431 0 67.752 30.241 67.752 67.247 0 9.068-1.735 17.857-5.369 26.202a22.832 22.832 0 0 0 12.335 30.236l0.01 0.01z" fill="#F5AA15"></path>
        <path d="M726.922 114.157c-25.969 0-51.65 3.744-76.315 10.942-18.423 5.472-28.868 24.622-23.5 42.91 5.509 18.29 24.804 28.657 43.237 23.329a201.888 201.888 0 0 1 56.578-8.064c109.253 0 198.189 88.271 198.189 196.696 0 19.436-2.905 38.729-8.419 57.16-5.508 18.289 4.79 37.588 23.212 43.053 3.342 1.014 6.817 1.442 10.159 1.442 14.943 0 28.725-9.648 33.37-24.48 7.547-24.906 11.462-50.826 11.462-77.175-0.143-146.588-120.278-265.813-267.973-265.813z" fill="#F5AA15"></path>
        <path d="M388.294 534.47c-84.151 0-152.34 59.178-152.34 132.334 0 73.141 68.189 132.328 152.34 132.328 84.148 0 152.337-59.182 152.337-132.328 0-73.15-68.19-132.334-152.337-132.334zM338.53 752.763c-29.454 0-53.39-23.755-53.39-52.987 0-29.228 23.941-52.989 53.39-52.989 29.453 0 53.39 23.76 53.39 52.989 0 29.227-23.937 52.987-53.39 52.987z m99.82-95.465c-6.382 11.086-19.296 15.696-28.726 10.219-9.43-5.323-11.75-18.717-5.37-29.803 6.386-11.09 19.297-15.7 28.725-10.224 9.43 5.472 11.755 18.864 5.37 29.808z" fill="#040000"></path>
      </svg>
    )
  },
  {
    label: '知乎',
    bg: 'transparent',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 73.28A438.72 438.72 0 1 0 950.72 512 438.72 438.72 0 0 0 512 73.28z m-98.56 458.88l-16.8 66.88 23.68-20.8s53.92 61.28 64 76.48 1.44 68.96 1.44 68.96l-92.48-113.12s-29.12 101.12-68.48 124.16a97.6 97.6 0 0 1-80 6.56 342.08 342.08 0 0 0 85.44-89.76 382.88 382.88 0 0 0 39.52-119.36h-115.04s8.8-40.48 24.16-41.6 90.88 0 90.88 0l-1.76-124.8-43.2 2.24a96 96 0 0 1-32 48c-24.16 17.44-38.4 10.88-38.4 10.88s42.72-118.24 55.84-141.28 50.4-25.12 50.4-25.12l-23.04 66.72h147.84c17.6 0 18.56 40.64 18.56 40.64h-90.56v122.56s61.28-2.24 81.12 0 19.68 41.6 19.68 41.6z m329.44 160h-91.52l-65.12 46.24-13.6-46.24h-36.96v-368h208z" fill="#49C0FB"></path>
        <path d="M602.88 691.68l54.88-41.44h43.04V364.64h-121.12v285.6h11.2l12 41.44z" fill="#49C0FB"></path>
      </svg>
    )
  },
];

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('小红书');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'document'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [useAgenticMode, setUseAgenticMode] = useState(false);
  const [tone, setTone] = useState('专业 Professional');
  const [wordLimit, setWordLimit] = useState(300);
  const [generateCount, setGenerateCount] = useState(1);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useEmojis, setUseEmojis] = useState(true);
  const [creativity, setCreativity] = useState<'保守' | '平衡' | '创新'>('平衡');
  const [targetAudience, setTargetAudience] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [mustExclude, setMustExclude] = useState('');

  // Agent 专用状态（仅用于展示工作流阶段）
  const [agentStages, setAgentStages] = useState<AgentStage[]>([]);
  const [extractedText, setExtractedText] = useState('');

  // 历史记录（本地浏览器持久化）
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const historyKey = 'smm_history_v1';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setHistoryItems(parsed as HistoryItem[]);
    } catch {
      // 忽略读取失败
    }
  }, []);

  const persistHistory = (next: HistoryItem[]) => {
    try {
      localStorage.setItem(historyKey, JSON.stringify(next));
    } catch {
      // 忽略写入失败（容量等）
    }
  };

  const pushHistoryItem = (item: HistoryItem) => {
    setHistoryItems((prev) => {
      const next = [item, ...prev].slice(0, 20);
      persistHistory(next);
      return next;
    });
  };

  const { showToast, ToastContainer } = useToast();

  // 辅助：从文件读取文本
  const readFileAsText = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }, []);

  // 开始 Agent 工作流（自动多版本，无需用户确认）
  const startAgentWorkflow = useCallback(async () => {
    if (inputMode === 'text' && !textInput.trim()) {
      showToast('⚠️ 请先输入文字内容', 'warning');
      return;
    }
    if (inputMode === 'document' && !selectedFile) {
      showToast('⚠️ 请先上传文件', 'warning');
      return;
    }

    setIsLoading(true);
    setShowWorkflow(true);
    setAgentStages([]);

    try {
      let inputTextLocal = '';
      if (inputMode === 'text') {
        inputTextLocal = textInput;
      } else {
        if (extractedText) {
          inputTextLocal = extractedText;
        } else if (selectedFile) {
          const text = await readFileAsText(selectedFile);
          setExtractedText(text);
          inputTextLocal = text;
        }
      }

      const runCount = Math.max(1, generateCount || 1);
      const allRunResults: GeneratedContent[] = [];
      let bestScore: number | null = null;
      let bestStagesRaw: any[] | null = null;
      let lastStagesRaw: any[] | null = null;

      for (let runIndex = 0; runIndex < runCount; runIndex++) {
        const res = await fetch('/api/agent-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'run',
            inputText: inputTextLocal,
            platform,
            tone,
            wordLimit,
            useHashtags,
            useEmojis,
            targetAudience,
            mustInclude,
            mustExclude,
            creativity,
            maxIterations: 2,
            targetScore: 85,
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        console.log(`[agent-generate] run ${runIndex + 1}/${runCount} trace:`, data.trace);

        const runResult = (data.results || [])[0];
        if (runResult) {
          allRunResults.push({
            id: runResult.id,
            content: runResult.content,
            platform: runResult.platform,
            createdAt: new Date(runResult.createdAt),
            score: runResult.score,
          });
        }

        lastStagesRaw = data.stages || null;

        if (typeof runResult?.score === 'number') {
          if (bestScore === null || runResult.score > bestScore) {
            bestScore = runResult.score;
            bestStagesRaw = data.stages || null;
          }
        } else if (!bestStagesRaw) {
          bestStagesRaw = data.stages || null;
        }
      }

      setResults(allRunResults);

      const stages = (bestStagesRaw || lastStagesRaw || []).map((s: any) => ({
        content: s.content || '',
        status: 'completed' as const,
      }));

      setAgentStages(stages);
      showToast('Agentic 工作流完成！', 'success');

      const inputPreview = String(inputTextLocal || '').trim().slice(0, 200);
      const agentStageItems = [
        { name: '需求分析', content: stages[0]?.content ?? '' },
        { name: '内容规划', content: stages[1]?.content ?? '' },
        { name: '初稿生成', content: stages[2]?.content ?? '' },
        { name: '扩展优化', content: stages[3]?.content ?? '' },
        { name: '最终润色', content: stages[4]?.content ?? '' },
      ];

      pushHistoryItem({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: 'agent',
        createdAt: new Date().toISOString(),
        params: {
          platform,
          tone,
          wordLimit,
          generateCount,
          useHashtags,
          useEmojis,
          creativity,
          targetAudience,
          mustInclude,
          mustExclude,
          inputPreview,
        },
        results: allRunResults.map((r) => ({
          id: r.id,
          content: r.content,
          platform: r.platform,
          createdAt: r.createdAt.toISOString(),
          score: r.score,
        })),
        agentStages: agentStageItems,
      });
    } catch (err: any) {
      showToast('Agentic 工作流失败，请稍后重试', 'error');
      console.error(err);
      setShowWorkflow(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    inputMode,
    textInput,
    selectedFile,
    extractedText,
    readFileAsText,
    generateCount,
    platform,
    tone,
    wordLimit,
    useHashtags,
    useEmojis,
    targetAudience,
    mustInclude,
    mustExclude,
    creativity,
    showToast,
  ]);

  // 普通生成（非 Agent）
  const handleNormalGenerate = useCallback(async () => {
    if (inputMode === 'text' && !textInput.trim()) {
      showToast('请先输入文字内容', 'warning');
      return;
    }
    if (inputMode === 'document' && !selectedFile) {
      showToast('请先上传文件', 'warning');
      return;
    }

    setIsLoading(true);
    setShowWorkflow(false);

    try {
      let res: Response;
      if (inputMode === 'text') {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputText: textInput,
            platform,
            tone,
            wordLimit,
            generateCount,
            useHashtags,
            useEmojis,
            creativity,
            targetAudience,
            mustInclude,
            mustExclude,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile!);
        formData.append('params', JSON.stringify({
          platform,
          tone,
          wordLimit,
          generateCount,
          useHashtags,
          useEmojis,
          targetAudience,
          mustInclude,
          mustExclude,
          creativity,
        }));
        res = await fetch('/api/generate', {
          method: 'POST',
          body: formData,
        });
      }

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const runResults: GeneratedContent[] = (data.results || []).map((item: any) => ({
        id: item.id,
        content: item.content,
        platform: item.platform,
        createdAt: new Date(item.createdAt),
        score: item.score,
      }));

      setResults(runResults);

      const inputPreview =
        inputMode === 'text'
          ? textInput.trim().slice(0, 200)
          : selectedFile
            ? `文件：${selectedFile.name}`.slice(0, 200)
            : '';

      pushHistoryItem({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: 'normal',
        createdAt: new Date().toISOString(),
        params: {
          platform,
          tone,
          wordLimit,
          generateCount,
          useHashtags,
          useEmojis,
          creativity,
          targetAudience,
          mustInclude,
          mustExclude,
          inputPreview,
        },
        results: runResults.map((r) => ({
          id: r.id,
          content: r.content,
          platform: r.platform,
          createdAt: r.createdAt.toISOString(),
          score: r.score,
        })),
      });
      showToast('内容生成成功！', 'success');
    } catch (err: any) {
      showToast('内容生成失败，请稍后重试', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [inputMode, textInput, selectedFile, platform, tone, wordLimit, generateCount, useHashtags, useEmojis, creativity, targetAudience, mustInclude, mustExclude, showToast]);

  const handleGenerate = useCallback(() => {
    if (useAgenticMode) {
      startAgentWorkflow();
    } else {
      handleNormalGenerate();
    }
  }, [useAgenticMode, startAgentWorkflow, handleNormalGenerate]);

  return (
    <ErrorBoundary>
      <ToastContainer />

      <div className="min-h-screen py-16 px-4 relative overflow-hidden">
        {/* 额外背景装饰：大光晕 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
          <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ddd6fe, transparent)' }} />
          {['top-[8%] left-[18%]','top-[20%] right-[12%]','top-[55%] left-[8%]','bottom-[20%] right-[18%]','bottom-[8%] left-[40%]'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-white/10 select-none text-2xl`}>✦</div>
          ))}
        </div>

        <div className="relative w-full mx-auto" style={{ maxWidth: '70vw', minWidth: '320px' }}>
          {/* ===== 顶部标题（在卡片外，白色文字） ===== */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 mb-5 text-xs font-medium rounded-full
                             bg-white/15 text-white border border-white/20 tracking-widest backdrop-blur-sm">
              人工智能社交媒体助手
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              几秒钟内即可免费生成<br />社交媒体帖子。
            </h1>
            <p className="text-white/60 text-base max-w-lg mx-auto mb-8">
              使用我们免费的AI社交媒体帖子生成器，保持内容创作的连贯性和高效性。
            </p>
            {/* 平台图标 */}
            <div className="flex justify-center flex-wrap gap-3">
              {PLATFORM_ICONS.map(p => (
                <div key={p.label} title={p.label}
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${p.bg}
                              shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-200 cursor-pointer`}>
                  {p.icon}
                </div>
              ))}
            </div>
          </div>

          {/* ===== 悬浮主卡片 ===== */}
          <div className="bg-white rounded-3xl shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="p-10 space-y-8">
              <FormPanel
                textInput={textInput}
                onTextChange={setTextInput}
                selectedFile={selectedFile}
                onFileChange={setSelectedFile}
                onModeChange={setInputMode}
                platform={platform}
                onPlatformChange={setPlatform}
                onConfigChange={(config) => {
                  setTone(config.tone);
                  setWordLimit(config.wordLimit);
                  setGenerateCount(config.generateCount);
                  setUseHashtags(config.useHashtags);
                  setUseEmojis(config.useEmojis);
                  setCreativity(config.creativity);
                  setTargetAudience(config.targetAudience);
                  setMustInclude(config.mustInclude);
                  setMustExclude(config.mustExclude);
                }}
              />

              <hr className="border-gray-100" />

              {/* Agentic 模式 */}
              <div className="flex justify-between items-center px-5 py-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm text-base">🤖</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Agentic 智能工作流</p>
                    <p className="text-xs text-gray-400">启用多阶段规划与执行</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-purple-600"
                  checked={useAgenticMode}
                  onChange={e => setUseAgenticMode(e.target.checked)}
                />
              </div>

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-4 text-base font-semibold rounded-2xl text-white transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-purple-400/40 hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    生成中...
                  </span>
                ) : useAgenticMode ? '启动智能工作流' : '生成帖子'}
              </button>
            </div>
          </div>

          {/* ===== 工作流卡片 ===== */}
          {showWorkflow && (
            <div className="mt-6 bg-white rounded-3xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3)]">
              <WorkflowVisualizer
                isActive={showWorkflow}
                stages={agentStages}
                currentStage={5}
                status="idle"
                onConfirm={() => {}}
                onRegenerate={() => {}}
              />
            </div>
          )}

          {/* ===== 结果卡片 ===== */}
          {results.length > 0 && (
            <div id="results-section"
              className="mt-6 bg-white rounded-3xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3)]">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">生成结果</h3>
              <ResultDisplay
                isLoading={false}
                results={results}
                onRegenerate={(id) => {
                  showToast('🔄 正在重新生成...', 'info');
                }}
                onEdit={(id) => showToast('✏️ 编辑模式已开启', 'info')}
                onResultsUpdate={(updatedResults) => {
                  setResults(updatedResults);
                  showToast('✨ 重新生成完成', 'success');
                }}
                regenerateParams={{
                  inputText: textInput,
                  platform,
                  tone,
                  wordLimit,
                  useHashtags,
                  useEmojis,
                  creativity,
                  targetAudience,
                  mustInclude,
                  mustExclude,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}