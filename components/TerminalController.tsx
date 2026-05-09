"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, FolderTree, FileText, Maximize2, Globe } from 'lucide-react';
import { useVFSStore } from '../store/vfsStore';
import { useLessonStore } from '../store/lessonStore';
import { useJudgeEngine } from '../lib/judgeEngine';

const THEME = {
  bg: 'bg-[#050505]',
  surface: 'bg-[#0a0a0a]',
  border: 'border-[#1a1a1a]',
  accent: 'text-[#00FF9F]',
  accentBg: 'bg-[#00FF9F]',
  error: 'text-[#FF00FF]',
  info: 'text-[#00D1FF]',
  muted: 'text-gray-500',
};

export const TerminalController = () => {
  const { vfs, currentPath, history, executeCommand, addHistory, getAutocomplete } = useVFSStore();
  const isDecrypting = useLessonStore((state) => state.isDecrypting);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const isPiping = input.includes('|');
  const isRedirecting = input.includes('>');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook up validation engine
  useJudgeEngine();

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completion = getAutocomplete(input);
      if (completion) {
        setInput(prev => prev + completion);
      }
      return;
    }

    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;

      setInput('');

      if (cmd.startsWith('gemini')) {
        addHistory({ type: 'input', content: `${currentPath} > ${cmd}` });
        setIsThinking(true);
        setTimeout(() => {
          setIsThinking(false);
          addHistory({ type: 'output', content: 'GEMINI CLI v0.1: Analysis complete. Required task identified.' });
        }, 1500);
        return;
      }

      executeCommand(cmd);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative font-mono text-sm selection:bg-[#00FF9F] selection:text-black">
      
      {/* Header */}
      <div className={`h-14 border-b ${THEME.border} flex items-center justify-between px-6 ${THEME.surface}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${THEME.accent}`} />
            <span className="text-xs font-bold uppercase tracking-widest font-[family-name:var(--font-orbitron)]">
              Active_Terminal.exe
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FolderTree className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {currentPath}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-white/5 rounded text-[10px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            LIVE_SESSION
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Terminal Area */}
        <div 
          className={`flex-1 flex flex-col p-6 overflow-hidden relative signal-shell-panel border-none rounded-none shadow-none transition-all duration-500 ${
            isDecrypting ? 'border-2 border-[#00FF9F] shadow-[0_0_30px_rgba(0,255,159,0.4)] animate-pulse' : 
            isPiping ? 'border-2 border-[#00D1FF]/40 shadow-[0_0_25px_rgba(0,209,255,0.2)]' :
            isRedirecting ? 'border-2 border-[#FF00FF]/40 shadow-[0_0_25px_rgba(255,0,255,0.2)]' : ''
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 mb-4 scrollbar-hide">
            {history.map((line, i) => (
              <div
                key={i}
                className={`leading-relaxed break-all ${
                  line.type === 'input' ? 'text-white font-bold' :
                  line.type === 'system' ? THEME.info :
                  line.type === 'output' ? 'text-gray-300' : ''
                }`}
              >
                {line.content}
              </div>
            ))}
            
            {isThinking && (
              <div className="flex items-center gap-3 py-2 animate-pulse">
                <div className="w-1/2 h-1 bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent bg-[length:200%_100%] animate-[scanline_2s_linear_infinite]"></div>
                <span className="text-[#FF00FF] text-xs">AWAITING NEURAL LINK...</span>
              </div>
            )}
            
            {!isThinking && (
              <div className="flex items-center gap-2">
                <span className={THEME.accent}>
                  {currentPath} {'>'}
                </span>
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white caret-[#00FF9F]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Side File Tree (Visual) - Desktop Only */}
        <div className={`w-64 border-l ${THEME.border} ${THEME.surface} p-4 hidden md:block overflow-y-auto scrollbar-hide`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
              Workspace
            </h3>
            <Maximize2 className="w-3 h-3 text-gray-600" />
          </div>
          <div className="space-y-1">
            {Object.entries(vfs).sort((a, b) => a[0].localeCompare(b[0])).map(([path, data]) => {
              const depth = path.split('/').filter(Boolean).length;
              const name = path.split('/').pop() || '/';
              return (
                <div key={path} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 cursor-default transition-all group" style={{ marginLeft: `${depth * 12}px` }}>
                  {data.type === 'dir' ? (
                    <div className="relative">
                      <FolderTree className="w-4 h-4 text-[#00D1FF] opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-[#00FF9F] opacity-0 group-hover:opacity-20 blur-[4px] rounded-full animate-pulse"></div>
                    </div>
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-[#00FF9F] transition-colors" />
                  )}
                  <span className={`text-xs transition-colors ${data.type === 'dir' ? 'font-medium text-[#00D1FF] group-hover:text-[#00FF9F]' : 'text-gray-400 group-hover:text-white'}`}>
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className={`h-6 border-t ${THEME.border} ${THEME.surface} flex items-center justify-between px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest font-sans shrink-0`}>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Node: localhost
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            Ping: 24ms
          </div>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span className={THEME.accent}>Connection: Encrypted</span>
        </div>
      </div>
    </div>
  );
};
