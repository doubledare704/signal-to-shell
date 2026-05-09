"use client";

import React from 'react';
import { useLessonStore, BLOCKS, LESSONS } from '@/store/lessonStore';
import { Play, Lock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

const THEME = {
  bg: 'bg-[#050505]',
  surface: 'bg-[#0a0a0a]',
  border: 'border-[#1a1a1a]',
  accent: 'text-[#00FF9F]',
  accentBg: 'bg-[#00FF9F]',
  muted: 'text-gray-500',
};

export const Dashboard = () => {
  const { currentLessonIdx, completedLessonIds, setView, setCurrentLessonIdx, maxLessonIdx } = useLessonStore();

  const getBlockProgress = (blockId: string) => {
    const blockLessonIds = LESSONS.filter(l => l.blockId === blockId).map(l => l.id);
    if (blockLessonIds.length === 0) return 0;
    
    const completedInBlock = blockLessonIds.filter(id => completedLessonIds.includes(id)).length;
    return Math.floor((completedInBlock / blockLessonIds.length) * 100);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${THEME.bg} text-white font-sans overflow-y-auto scrollbar-hide w-full`}>
      {/* Hero Header */}
      <div className="py-24 px-12 border-b border-[#1a1a1a] bg-gradient-to-br from-[#0a0a0a] to-[#050505] relative overflow-hidden flex-shrink-0 min-h-[450px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF9F] opacity-[0.03] blur-[120px] rounded-full -mr-48 -mt-48"></div>
        
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] border border-[#00FF9F]/30 ${THEME.accent} bg-[#00FF9F]/5 uppercase`}>
              Agentic_Curriculum_v1.0
            </span>
          </div>
          
          <h1 className="text-6xl font-black mb-8 tracking-tighter font-[family-name:var(--font-orbitron)] leading-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ZERO TO <span className={THEME.accent}>GEMINI</span>
          </h1>
          
          <p className="text-gray-300 text-xl leading-relaxed max-w-3xl font-[family-name:var(--font-rajdhani)] font-medium">
            Master the Gemini Command Line Interface. From basic shell initialization to complex Virtual File System (VFS) manipulation and neural-prompt engineering. This curriculum is designed for high-stakes digital operations.
          </p>

          <div className="mt-10 flex gap-6">
            <button 
              onClick={() => setView('lesson')}
              className={`flex items-center gap-3 px-8 py-4 ${THEME.accentBg} text-black font-bold rounded-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,255,159,0.3)] group`}
            >
              <Play className="w-5 h-5 fill-current" />
              RESUME_SESSION
            </button>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Overall Progress</span>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${THEME.accentBg} shadow-[0_0_10px_#00FF9F]`} 
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
            const isLocked = firstLessonIdx > maxLessonIdx && i > 0; // Block 1 is always available
            const isCompleted = progress === 100;
            const isActive = progress > 0 && progress < 100;

            return (
              <div 
                key={block.id}
                onClick={() => {
                  if (!isLocked) {
                    const firstLessonIdx = LESSONS.findIndex(l => l.blockId === block.id);
                    if (firstLessonIdx !== -1) {
                      setCurrentLessonIdx(firstLessonIdx);
                      setView('lesson');
                    }
                  }
                }}
                className={`group relative p-8 border ${isLocked ? 'border-[#1a1a1a] opacity-60' : 'border-[#2a2a2a] hover:border-[#00FF9F]/40'} ${THEME.surface} transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Background Accent */}
                {!isLocked && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF9F] opacity-0 group-hover:opacity-[0.03] blur-[40px] transition-opacity"></div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-sm ${isLocked ? 'bg-white/5 text-gray-600' : 'bg-[#00FF9F]/10 text-[#00FF9F]'}`}>
                    {isLocked ? <Lock className="w-6 h-6" /> : (isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />)}
                  </div>
                  {!isLocked && (
                    <span className={`text-[10px] font-bold font-mono ${progress === 100 ? 'text-[#00FF9F]' : 'text-gray-500'}`}>
                      {progress}% COMPLETE
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className={`text-sm font-bold tracking-widest uppercase font-mono ${isLocked ? 'text-gray-600' : THEME.accent}`}>
                    {block.title}
                  </h3>
                  <h4 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">
                    {block.subtitle}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-[family-name:var(--font-rajdhani)] mt-4">
                    {block.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-[#1a1a1a] flex items-center justify-center">
                        <div className={`w-1 h-1 rounded-full ${isLocked ? 'bg-gray-600' : 'bg-[#00FF9F]'}`}></div>
                      </div>
                    ))}
                  </div>
                  {!isLocked && (
                    <ChevronRight className={`w-5 h-5 ${THEME.accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                  )}
                </div>

                {/* Progress bar at bottom */}
                {!isLocked && (
                  <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-[#00FF9F]/20 w-full"
                  >
                    <div 
                      className={`h-full ${THEME.accentBg} shadow-[0_0_10px_#00FF9F]`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-12 border-t border-[#1a1a1a] flex justify-between items-center text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase font-mono flex-shrink-0">
        <div className="flex gap-8">
          <span>Server: NEXUS_PRIMARY</span>
          <span>Latency: MINIMAL</span>
        </div>
        <div className="flex gap-8">
          <span>© 2026 Signal to Shell</span>
          <span className={THEME.accent}>STATUS: OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
};
