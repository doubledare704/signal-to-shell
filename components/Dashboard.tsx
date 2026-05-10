"use client";

import React from 'react';
import { useLessonStore, BLOCKS, LESSONS } from '@/store/lessonStore';
import { Play, Lock, ChevronRight, Zap } from 'lucide-react';

const THEME = {
  bg: 'bg-[#050505]',
  surface: 'bg-[#0a0a0a]',
  border: 'border-[#1a1a1a]',
  accent: 'text-[#00FF9F]',
  accentBg: 'bg-[#00FF9F]',
  muted: 'text-gray-500',
  b5Accent: 'text-[#D4AF37]',
  b5AccentBg: 'bg-[#D4AF37]',
  b7Accent: 'text-[#FF4500]',
  b7AccentBg: 'bg-[#FF4500]',
};

export const Dashboard = () => {
  const { completedLessonIds, setView, setCurrentLessonIdx, maxLessonIdx } = useLessonStore();
  const isB5Complete = LESSONS.filter(l => l.blockId === 'B5').every(l => completedLessonIds.includes(l.id));
  const isB7Complete = LESSONS.filter(l => l.blockId === 'B7').every(l => completedLessonIds.includes(l.id));

  const getBlockProgress = (blockId: string) => {
    const blockLessonIds = LESSONS.filter(l => l.blockId === blockId).map(l => l.id);
    if (blockLessonIds.length === 0) return 0;
    
    const completedInBlock = blockLessonIds.filter(id => completedLessonIds.includes(id)).length;
    return Math.floor((completedInBlock / blockLessonIds.length) * 100);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${THEME.bg} text-white font-sans overflow-y-auto scrollbar-hide w-full`}>
      {/* Hero Header */}
      <div className="py-24 px-12 border-b border-[#1a1a1a] bg-gradient-to-br from-[#0a0a0a] to-[#050505] relative overflow-hidden flex-shrink-0 min-h-[450px] flex flex-col justify-center group">
        <div className={`absolute top-0 right-0 w-96 h-96 ${isB5Complete ? 'bg-[#D4AF37]' : 'bg-[#00FF9F]'} opacity-[0.03] blur-[120px] rounded-full -mr-48 -mt-48`}></div>
        
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] border ${isB5Complete ? 'border-[#D4AF37]/30 text-[#D4AF37]' : 'border-[#00FF9F]/30 text-[#00FF9F]'} bg-white/5 uppercase`}>
              {isB5Complete ? 'Architect_Accredited_v1.0' : 'Agentic_Curriculum_v1.0'}
            </span>
          </div>
          
          <h1 className="text-6xl font-black mb-8 tracking-tighter font-[family-name:var(--font-orbitron)] leading-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ZERO TO <span className={isB5Complete ? 'text-[#D4AF37]' : THEME.accent}>{isB5Complete ? 'ARCHITECT' : 'GEMINI'}</span>
          </h1>
          
          <p className="text-gray-300 text-xl leading-relaxed max-w-3xl font-[family-name:var(--font-rajdhani)] font-medium">
            {isB5Complete 
              ? "The Nexus is stable. You have mastered the Gemini Command Line Interface and orchestrated autonomous systems. The machine is now your instrument."
              : "Master the Gemini Command Line Interface. From basic shell initialization to complex Virtual File System (VFS) manipulation and agentic orchestration."
            }
          </p>

          <div className="mt-10 flex gap-6">
            <button 
              onClick={() => setView('lesson')}
              className={`flex items-center gap-3 px-8 py-4 ${isB5Complete ? 'bg-[#D4AF37]' : THEME.accentBg} text-black font-bold rounded-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,255,159,0.3)] group`}
            >
              <Play className="w-5 h-5 fill-current" />
              {isB5Complete ? 'RETURN_TO_SESSION' : 'RESUME_SESSION'}
            </button>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Overall Progress</span>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isB5Complete ? 'bg-[#D4AF37]' : THEME.accentBg} shadow-[0_0_10px_${isB5Complete ? '#D4AF37' : '#00FF9F'}]`} 
                  style={{ width: `${Math.floor((completedLessonIds.length / LESSONS.length) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="p-12 max-w-6xl w-full mx-auto flex-shrink-0">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-12">Deployment_Phases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOCKS.map((block, i) => {
            const progress = getBlockProgress(block.id);
            const firstLessonIdx = LESSONS.findIndex(l => l.blockId === block.id);
            const isLocked = firstLessonIdx > maxLessonIdx && i > 0;
            const isB5 = block.id === 'B5';
            const isB7 = block.id === 'B7';
            const blockAccent = isB7 ? 'text-[#FF4500]' : isB5 ? 'text-[#D4AF37]' : THEME.accent;
            const blockAccentBg = isB7 ? 'bg-[#FF4500]' : isB5 ? 'bg-[#D4AF37]' : THEME.accentBg;

            return (
              <div 
                key={block.id}
                onClick={() => {
                  if (!isLocked) {
                    const firstIdx = LESSONS.findIndex(l => l.blockId === block.id);
                    if (firstIdx !== -1) {
                      setCurrentLessonIdx(firstIdx);
                      setView('lesson');
                    }
                  }
                }}
                className={`group relative p-8 border ${isLocked ? 'border-[#1a1a1a] opacity-60' : `border-[#2a2a2a] hover:border-${isB5 ? '[#D4AF37]' : '[#00FF9F]'}/40`} ${THEME.surface} transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Background Accent */}
                {!isLocked && (
                  <div className={`absolute top-0 right-0 w-32 h-32 ${isB7 ? 'bg-[#FF4500]' : isB5 ? 'bg-[#D4AF37]' : 'bg-[#00FF9F]'} opacity-0 group-hover:opacity-[0.03] blur-[40px] transition-opacity`}></div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-sm ${isLocked ? 'bg-white/5 text-gray-600' : `bg-black/40 ${blockAccent} border border-white/5`}`}>
                    {isLocked ? <Lock className="w-5 h-5" /> : <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest block mb-1">Status</span>
                    <span className={`text-[10px] font-bold uppercase ${progress === 100 ? blockAccent : 'text-white/60'}`}>
                      {isLocked ? 'LOCKED' : progress === 100 ? 'Verified' : 'In_Progress'}
                    </span>
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)] group-hover:${blockAccent} transition-colors uppercase`}>
                  {block.title}
                </h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${blockAccent} opacity-60`}>
                  {block.subtitle}
                </p>
                <p className="text-sm text-gray-400 font-[family-name:var(--font-rajdhani)] leading-snug">
                  {block.description}
                </p>

                {!isLocked && (
                  <div className="mt-8 flex items-center justify-between">
                    <div className="w-full bg-white/5 h-1 mr-4 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${blockAccentBg} transition-all duration-1000`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-700 group-hover:${blockAccent} group-hover:translate-x-1 transition-all flex-shrink-0`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div className={`mt-auto p-6 border-t ${THEME.border} flex items-center justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest`}>
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isB7Complete ? 'bg-[#FF4500] animate-pulse' : isB5Complete ? 'bg-[#D4AF37] animate-pulse' : 'bg-green-500'}`}></div>
            System: Stable
          </span>
          <span>Architect_Level: {isB7Complete ? '07 (Headless)' : isB5Complete ? '05 (Master)' : '01'}</span>
          <span>Latency: Minimal</span>
        </div>
        <div className="flex gap-8">
          <span>© 2026 Signal to Shell</span>
          <span className={isB7Complete ? 'text-[#FF4500]' : isB5Complete ? 'text-[#D4AF37]' : THEME.accent}>Status: Operational</span>
        </div>
      </div>
    </div>
  );
};
