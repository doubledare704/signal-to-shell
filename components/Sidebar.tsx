"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Command, CheckCircle2, FolderTree, FileText, LayoutGrid, ArrowLeft, Info, HelpCircle, Zap, ChevronRight } from 'lucide-react';
import { useLessonStore, LESSONS, BLOCKS } from '../store/lessonStore';
import { useVFSStore } from '../store/vfsStore';
import DecryptText from './DecryptText';

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

export const Sidebar = () => {
  const { 
    currentLessonIdx, 
    currentTaskIdx, 
    isSuccess, 
    view, 
    setView, 
    nextLesson, 
    jumpToLesson,
    completedLessonIds,
    maxLessonIdx
  } = useLessonStore();

  const isLastLesson = currentLessonIdx === LESSONS.length - 1;
  const vfs = useVFSStore((state) => state.vfs);
  const [decryptionComplete, setDecryptionComplete] = useState(false);

  useEffect(() => {
    if (!isSuccess) {
      setDecryptionComplete(false);
    }
  }, [isSuccess]);

  const currentLesson = LESSONS[currentLessonIdx];
  const isBlockComplete = LESSONS.filter(l => l.blockId === currentLesson.blockId)
    .every(l => completedLessonIds.includes(l.id));

  return (
    <div className={`w-full md:w-1/3 flex flex-col border-r ${THEME.border} ${THEME.surface} font-sans`}>
      <div className={`p-6 border-b ${THEME.border} flex items-center justify-between`}>
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('dashboard')}
        >
          <div className={`w-3 h-3 rounded-full ${THEME.accentBg} animate-pulse shadow-[0_0_8px_#00FF9F]`}></div>
          <h1 className="font-bold tracking-widest text-lg uppercase font-[family-name:var(--font-orbitron)] group-hover:text-[#00FF9F] transition-colors">
            Signal to <span className={THEME.accent}>shell</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {view === 'lesson' && (
            <button 
              onClick={() => setView('dashboard')}
              className="text-gray-600 hover:text-white transition-colors"
              title="Dashboard"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          )}
          <Settings className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {view === 'dashboard' ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Info className={`w-5 h-5 ${THEME.accent}`} />
                <h2 className="text-xl font-bold tracking-tight font-[family-name:var(--font-orbitron)] uppercase">
                  Nexus Intelligence
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-400 font-[family-name:var(--font-rajdhani)] leading-relaxed text-base">
                <p>
                  Operative, you are standing at the threshold of the <span className={THEME.accent}>Signal to Shell</span> matrix. This is not merely a terminal; it is a bridge between the physical and the neural.
                </p>
                <p>
                  Your objective is clear: evolve from a standard biological processor to a <span className="text-white">Master of the Gemini Protocol</span>. Through five deployment phases, you will master the atomic manipulation of data, the flow of command streams, and the eventual orchestration of autonomous agentic swarms.
                </p>
                <div className={`p-4 border border-[#00FF9F]/20 bg-[#00FF9F]/5 rounded shadow-[inset_0_0_10px_rgba(0,255,159,0.05)]`}>
                  <p className="text-xs italic text-[#00FF9F]/70">
                    "The shell is the air that we breathe. Mastery is not an option; it is a requirement for survival in the post-signal era."
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className={`w-5 h-5 ${THEME.accent}`} />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] font-mono">
                  Navigation_Guide
                </h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: <LayoutGrid className="w-4 h-4" />, title: "The Nexus Hub", desc: "Select a Deployment Phase from the grid to initialize your training." },
                  { icon: <Zap className="w-5 h-5" />, title: "Live Progression", desc: "Your progress is tracked across the neural link. Previous nodes remain accessible." },
                  { icon: <Command className="w-4 h-4" />, title: "Command Entry", desc: "Execute signals within the terminal to satisfy node requirements." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className={`mt-1 p-2 rounded bg-white/5 ${THEME.accent} border border-white/5 group-hover:border-[#00FF9F]/30 transition-colors`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1 font-mono uppercase tracking-wider">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-[family-name:var(--font-rajdhani)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => setView('lesson')}
                className={`w-full py-4 border border-[#00FF9F]/40 text-[#00FF9F] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#00FF9F]/10 transition-all flex items-center justify-center gap-2 font-mono group`}
              >
                Return_to_Active_Terminal
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] border border-[#00FF9F] ${THEME.accent} font-mono uppercase tracking-widest`}>
                  {completedLessonIds.includes(currentLesson.id) ? 'COMPLETED' : `LEVEL ${currentLesson.id.split('-')[0].replace('L', '')}`}
                </span>
                <h2 className="text-xl font-semibold tracking-tight font-[family-name:var(--font-rajdhani)]">
                  {currentLesson.title.split(': ')[1] || currentLesson.title}
                </h2>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-4 font-[family-name:var(--font-rajdhani)]">
                {currentLesson.description}
              </p>

              {currentLesson.example && (
                <div className="bg-[#00FF9F]/10 border border-[#00FF9F]/50 p-3 rounded mb-4 text-[#00FF9F] font-mono text-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#00FF9F]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="font-bold opacity-70 block mb-1 text-[10px] tracking-widest uppercase">Example Command</span>
                  <span className="relative z-10">&gt; {currentLesson.example}</span>
                </div>
              )}

              <div className={`p-4 rounded border border-dashed border-[#1a1a1a] bg-black/50 group space-y-3`}>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <Command className="w-3 h-3" /> Objectives
                </div>
                {currentLesson.tasks.map((task, idx) => {
                  const isCompleted = idx < currentTaskIdx || isSuccess;
                  const isCurrent = idx === currentTaskIdx && !isSuccess;
                  
                  return (
                      <div key={task.id} className={`flex items-start gap-2 ${isCompleted ? THEME.muted : isCurrent ? 'text-white' : 'text-gray-600 opacity-50'}`}>
                        <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 ${THEME.accent}`} />
                            ) : isCurrent ? (
                              <div className={`w-4 h-4 rounded-full border border-[#00FF9F] flex items-center justify-center animate-pulse`}>
                                  <div className="w-2 h-2 rounded-full bg-[#00FF9F]"></div>
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-600"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <code className={`block text-xs font-mono ${isCompleted ? 'line-through opacity-70' : isCurrent ? THEME.accent : ''}`}>
                              {task.instruction}
                            </code>
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>

            {isSuccess && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-4 rounded border border-[#00FF9F]/30 bg-[#00FF9F]/5 flex flex-col gap-3`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${THEME.accent} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`font-bold ${THEME.accent} font-[family-name:var(--font-rajdhani)] text-lg mb-2`}>
                        <DecryptText 
                          text={currentLesson.feedback.success} 
                          onComplete={() => setDecryptionComplete(true)} 
                        />
                      </p>
                    </div>
                  </div>
                  
                  {decryptionComplete && (
                    <div className="space-y-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
                      <button
                        onClick={() => {
                          if (isLastLesson) {
                            setView('dashboard');
                          } else {
                            nextLesson();
                          }
                        }}
                        className={`w-full py-3 ${THEME.accentBg} text-black font-bold uppercase tracking-tighter text-xs hover:shadow-[0_0_20px_#00FF9F] transition-all font-[family-name:var(--font-rajdhani)] text-sm flex items-center justify-center gap-2`}
                      >
                        {isLastLesson ? 'Finish Block & Return to Nexus' : 'Proceed to Next Node'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      
                      {isLastLesson && (
                        <button
                          onClick={() => setView('dashboard')}
                          className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all font-mono"
                        >
                          View Deployment Phases
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                  Course Progress
                </p>
                {view === 'lesson' && (
                  <button 
                    onClick={() => setView('dashboard')}
                    className={`text-[10px] font-bold ${THEME.accent} uppercase tracking-widest flex items-center gap-1 hover:opacity-80 transition-opacity`}
                  >
                    <ArrowLeft className="w-3 h-3" /> Dashboard
                  </button>
                )}
              </div>
              {LESSONS.map((l, i) => {
                const block = BLOCKS.find(b => b.id === l.blockId);
                const isLocked = i > maxLessonIdx;
                
                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      if (!isLocked) jumpToLesson(i);
                    }}
                    className={`flex items-center gap-3 p-2 rounded transition-colors ${
                      isLocked ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-white/10'
                    } ${i === currentLessonIdx ? 'bg-white/5 border border-[#00FF9F]/20' : ''}`}
                  >
                    <span className={`text-xs font-mono ${i <= currentLessonIdx ? THEME.accent : 'text-gray-600'}`}>
                      {l.id.toString().padStart(2, '0')}
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-[family-name:var(--font-rajdhani)] font-medium">
                        {l.title.split(': ')[1] || l.title}
                      </span>
                      {i === currentLessonIdx && (
                        <span className="text-[9px] text-[#00FF9F]/50 uppercase tracking-widest font-mono">
                          {block?.subtitle}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      {completedLessonIds.includes(l.id) ? (
                        <CheckCircle2 className={`w-3 h-3 ${THEME.accent}`} />
                      ) : isLocked ? (
                        <HelpCircle className="w-3 h-3 text-gray-700" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
