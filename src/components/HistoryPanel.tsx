'use client';

import { useMemo, useState } from 'react';

export type HistoryItemType = 'agent' | 'normal';

export interface HistoryResult {
  id: number;
  content: string;
  platform: string;
  createdAt: string; // ISO string
  score?: number;
}

export interface HistoryAgentStage {
  name: string;
  content: string;
}

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  createdAt: string; // ISO string
  params: {
    platform: string;
    tone: string;
    wordLimit: number;
    generateCount: number;
    useHashtags: boolean;
    useEmojis: boolean;
    creativity: string;
    targetAudience?: string;
    mustInclude?: string;
    mustExclude?: string;
    inputPreview?: string;
  };
  results: HistoryResult[];
  agentStages?: HistoryAgentStage[];
}

function formatLocalTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function HistoryPanel({
  items,
  onDelete,
  onClearAll,
}: {
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [items]);

  return (
    <div className="mt-6 bg-white rounded-3xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">历史记录</h3>
          <p className="text-sm text-gray-500">{sorted.length} 条</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClearAll}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            disabled={sorted.length === 0}
          >
            清空全部
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-sm text-gray-500">暂无历史记录。</div>
      ) : (
        <div className="space-y-4">
          {sorted.map((item) => {
            const isExpanded = expandedId === item.id;
            const bestScore = item.results?.[0]?.score;
            return (
              <div key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                <div
                  className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  role="button"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-semibold">
                        {item.type === 'agent' ? 'Agent' : '普通生成'}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">{item.params.platform}</span>
                      {typeof bestScore === 'number' && (
                        <span className="text-xs text-gray-500">分数：{bestScore}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatLocalTime(item.createdAt)}</div>
                    {item.params.inputPreview && (
                      <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {item.params.inputPreview}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-xs text-gray-500">
                    {isExpanded ? '收起 ▲' : '展开 ▼'}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">生成结果</div>
                        <div className="space-y-3">
                          {item.results.map((r, idx) => (
                            <div key={`${r.id}-${idx}`} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="text-sm font-semibold text-gray-800">
                                  版本 {idx + 1}
                                </div>
                                {typeof r.score === 'number' && (
                                  <div className="text-xs text-gray-500">score: {r.score}</div>
                                )}
                              </div>
                              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {r.content}
                              </div>
                              <div className="flex gap-3 mt-3">
                                <button
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(r.content);
                                    } catch {
                                      alert('复制失败，请手动复制');
                                    }
                                  }}
                                  className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                                >
                                  复制内容
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {item.agentStages && item.agentStages.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Agent 5 阶段输出</div>
                          <div className="space-y-3">
                            {item.agentStages.map((s) => (
                              <details key={s.name} className="bg-white border border-gray-200 rounded-xl p-3">
                                <summary className="text-sm font-semibold text-gray-800 cursor-pointer">
                                  {s.name}
                                </summary>
                                <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                  {s.content}
                                </pre>
                              </details>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onDelete(item.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

