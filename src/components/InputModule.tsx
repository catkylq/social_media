'use client';

import React, { useState } from 'react';
import URLAnalysisDisplay from './URLAnalysisDisplay';

type InputMode = 'text' | 'url' | 'document';

type InputModuleProps = {
  textInput: string;
  onTextChange: React.Dispatch<React.SetStateAction<string>>;
  urlInput: string;
  onURLChange: React.Dispatch<React.SetStateAction<string>>;
  selectedFile: File | null;
  onFileChange: React.Dispatch<React.SetStateAction<File | null>>;
  isAnalyzing: boolean;
  onAnalyzeURL: () => Promise<void>;
  onModeChange?: (mode: InputMode) => void; // 新增回调
};

export default function InputModule({
  textInput,
  onTextChange,
  urlInput,
  onURLChange,
  selectedFile,
  onFileChange,
  isAnalyzing,
  onAnalyzeURL,
  onModeChange,
}: InputModuleProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [urlError, setUrlError] = useState('');

  const validateURL = (url: string) => {
    try { new URL(url); setUrlError(''); return true; } 
    catch { setUrlError('请输入有效 URL'); return false; }
  };

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    if (onModeChange) onModeChange(mode); // 通知父组件
  };

  return (
    <div className="space-y-6">
      {/* 输入方式切换 */}
      <div className="grid grid-cols-3 bg-gray-100 rounded-full p-1">
        {['text','url','document'].map(mode => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode as InputMode)}
            className={`py-2 text-sm font-medium rounded-full transition ${inputMode === mode ? 'bg-white shadow text-blue-600':'text-gray-500 hover:text-gray-700'}`}
          >
            {mode==='text'?'📝文字':mode==='url'?'🔗链接':'📄文档'}
          </button>
        ))}
      </div>

      {/* 文字输入 */}
      {inputMode==='text' && (
        <textarea
          value={textInput}
          onChange={e=>onTextChange(e.target.value)}
          placeholder="例如：为新产品生成小红书文案"
          className="w-full min-h-[140px] px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none"
        />
      )}

      {/* URL 输入 */}
      {inputMode==='url' && (
        <div className="flex gap-3">
          <input
            value={urlInput}
            onChange={e=>{onURLChange(e.target.value); urlError && validateURL(e.target.value);}}
            placeholder="https://example.com"
            className={`flex-1 px-4 py-3 border rounded-full ${urlError?'border-red-300':'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
          />
          <button
            disabled={!urlInput || !!urlError || isAnalyzing}
            onClick={onAnalyzeURL}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full disabled:opacity-50"
          >
            {isAnalyzing?'分析中...':'🔍 分析'}
          </button>
        </div>
      )}

      {/* 文档上传 */}
      {inputMode==='document' && (
        <div>
          {!selectedFile ? (
            <label className="block p-6 border-2 border-dashed rounded-2xl cursor-pointer">
              <input type="file" className="hidden" onChange={e=>onFileChange(e.target.files?.[0]??null)} />
              点击上传或拖拽文件 (PDF/Word/TXT)
            </label>
          ) : (
            <div className="flex justify-between items-center p-4 border rounded-2xl bg-gray-50">
              <div>{selectedFile.name} ({(selectedFile.size/1024).toFixed(1)} KB)</div>
              <button onClick={()=>onFileChange(null)}>✕</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
