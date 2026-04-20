'use client';

import { useEffect, useState } from 'react';
import HistoryPanel from '@/components/HistoryPanel';
import type { HistoryItem } from '@/components/HistoryPanel';

const HISTORY_KEY = 'smm_history_v1';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setHistoryItems(parsed);
    } catch (e) {
      console.error('加载历史记录失败', e);
    }
  }, []);

  const persistHistory = (items: HistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('保存历史记录失败', e);
    }
  };

  const handleDelete = (id: string) => {
    const newItems = historyItems.filter((item) => item.id !== id);
    setHistoryItems(newItems);
    persistHistory(newItems);
  };

  const handleClearAll = () => {
    setHistoryItems([]);
    persistHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">历史记录</h1>
          <p className="text-gray-500 mt-1">所有生成的内容都会自动保存，方便您随时查阅和复用。</p>
        </div>
        <HistoryPanel
          items={historyItems}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}