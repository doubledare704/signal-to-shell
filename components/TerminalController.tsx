"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, FolderTree, FileText, Maximize2, Globe, Shield, KeyRound } from 'lucide-react';
import { useVFSStore } from '../store/vfsStore';
import { useLessonStore, LESSONS } from '../store/lessonStore';
import { useJudgeEngine } from '../lib/judgeEngine';
import LogicFeed from './LogicFeed';

const THEME = {
  bg: 'bg-[#050505]',
  surface: 'bg-[#0a0a0a]',
  border: 'border-[#1a1a1a]',
  accent: 'text-[#00FF9F]',
  accentBg: 'bg-[#00FF9F]',
  error: 'text-[#FF00FF]',
  info: 'text-[#00D1FF]',
  muted: 'text-gray-500',
  b5Accent: 'text-[#D4AF37]',
  b5AccentBg: 'bg-[#D4AF37]',
  b6Accent: 'text-[#8A2BE2]',
  b6AccentBg: 'bg-[#8A2BE2]',
  b7Accent: 'text-[#FF4500]',
  b7AccentBg: 'bg-[#FF4500]',
};

export const TerminalController = () => {
  const { vfs, currentPath, history, executeCommand, addHistory, getAutocomplete } = useVFSStore();
  const { isDecrypting, currentBlockId, currentLessonIdx, currentLogicStepIdx, agentStatus, authMode, setAuthMode, setApiKey } = useLessonStore();
  
  const isB5 = currentBlockId === 'B5';
  const isB6 = currentBlockId === 'B6';
  const isB7 = currentBlockId === 'B7';
  const activeAccent = isB7 ? THEME.b7Accent : isB6 ? THEME.b6Accent : isB5 ? THEME.b5Accent : THEME.accent;
  const activeAccentBg = isB7 ? THEME.b7AccentBg : isB6 ? THEME.b6AccentBg : isB5 ? THEME.b5AccentBg : THEME.accentBg;

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const isPiping = input.includes('|');
  const isRedirecting = input.includes('>');
  
  const currentLesson = LESSONS[currentLessonIdx];
  const currentLogicStep = currentLesson?.logicChain?.[currentLogicStepIdx] || null;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook up validation engine
  useJudgeEngine();

  // Auto-scroll terminal
  useEffect(() => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      if (last.type === 'output' && (last.content.includes('gemini') || last.content.includes('|⌐■_■|'))) {
        setShowIndicator(true);
        const timer = setTimeout(() => setShowIndicator(false), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [history]);

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

      if (authMode) {
        setApiKey(cmd);
        setAuthMode(false);
        setInput('');
        addHistory({ type: 'system', content: '[OK] SIGNAL_VOLATILITY_CONFIRMED. STATE_SYNCHRONIZATION_ACTIVE.' });
        return;
      }

      setInput('');



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
          {isB7 && (
            <div className="px-2 py-1 bg-[#FF4500]/10 border border-[#FF4500]/30 rounded text-[10px] flex items-center gap-3 text-[#FF4500]">
              <span className="flex items-center gap-1" title="CORS Lock">
                <Shield className="w-3 h-3" />
                CORS_LOCK
              </span>
              <span className="flex items-center gap-1" title="Auth Pulse">
                <KeyRound className="w-3 h-3 animate-pulse" />
                AUTH_PULSE
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Terminal Area */}
        <div 
          className={`flex-1 flex flex-col p-6 overflow-hidden relative signal-shell-panel border-none rounded-none shadow-none transition-all duration-500 ${
            isDecrypting ? 'border-2 border-[#00FF9F] shadow-[0_0_30px_rgba(0,255,159,0.4)] animate-pulse' : 
            authMode ? 'border-2 border-[#00D1FF] shadow-[0_0_50px_rgba(0,209,255,0.6)] animate-[pulse_1s_infinite]' :
            isPiping ? 'border-2 border-[#00D1FF]/40 shadow-[0_0_25px_rgba(0,209,255,0.2)]' :
            isRedirecting ? 'border-2 border-[#FF00FF]/40 shadow-[0_0_25px_rgba(255,0,255,0.2)]' : ''
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {showIndicator && (
            <div className="absolute top-6 right-6 font-mono text-[#00D1FF] animate-bounce z-20 bg-[#00D1FF]/10 px-3 py-1 border border-[#00D1FF]/30 backdrop-blur-sm">
              |⌐■_■|
            </div>
          )}
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
                <span className={authMode ? THEME.info : THEME.accent}>
                  {authMode ? 'SIGNAL_KEY >' : `${currentPath} >`}
                </span>
                <input
                  ref={inputRef}
                  autoFocus
                  type={authMode ? "password" : "text"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white caret-[#00FF9F]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Side Panel (VFS or LogicFeed) */}
        {currentLesson?.logicChain ? (
          <LogicFeed currentStep={currentLogicStep} status={agentStatus} />
        ) : (
          <div className={`w-64 border-l ${THEME.border} ${THEME.surface} p-4 hidden md:block overflow-y-auto scrollbar-hide`}>
            {isB6 && (
              <div className="mb-6 p-3 border border-[#8A2BE2]/30 bg-[#8A2BE2]/5 rounded-lg overflow-hidden relative group">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#8A2BE2] uppercase tracking-tighter">Vector_Map.vfx</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] animate-pulse"></div>
                 </div>
                 <div className="h-32 w-full relative">
                    {/* Mock Vector Map dots */}
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-1 bg-[#8A2BE2] rounded-full animate-pulse"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          opacity: 0.4 + Math.random() * 0.6,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 border border-[#8A2BE2]/20 rounded-full animate-[ping_3s_infinite]"></div>
                    </div>
                 </div>
                 <div className="mt-2 text-[9px] text-[#8A2BE2]/60 font-bold uppercase text-center">
                    Searching_Semantic_Space...
                 </div>
              </div>
            )}
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
        )}
      </div>

      {/* Footer Status Bar */}
      <div className={`h-6 border-t ${THEME.border} ${THEME.surface} flex items-center justify-between px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest font-sans shrink-0`}>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Node: localhost
          </div>
          {currentBlockId === 'B4' && (
            <div className={`flex items-center gap-1.5 ${THEME.info} animate-pulse`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]"></div>
              SIGNAL: ACTIVE (VOLATILE)
            </div>
          )}
          {currentBlockId === 'B7' && (
            <div className="flex items-center gap-3 text-[#FF4500] animate-pulse">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]"></div>
                HTTP: 200
              </span>
              <span>Ping: 42ms</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            Ping: 24ms
          </div>
        </div>
        <div className="flex gap-4">
          {currentBlockId === 'B4' && (
            <div className="flex items-center gap-4 border-r border-[#1a1a1a] pr-4 mr-2">
              <span className="text-gray-500">IN: <span className={THEME.info}>1.2M</span></span>
              <span className="text-gray-500">OUT: <span className={THEME.accent}>42K</span></span>
            </div>
          )}
          <span>UTF-8</span>
          <span className={activeAccent}>Connection: Encrypted</span>
        </div>
      </div>
    </div>
  );
};
