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
  b5Accent: 'text-[#D4AF37]',
  b5AccentBg: 'bg-[#D4AF37]',
  b7Accent: 'text-[#FF4500]',
  b7AccentBg: 'bg-[#FF4500]',
  b8Accent: 'text-[#F5F5F5]',
  b8AccentBg: 'bg-[#F5F5F5]',
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
    maxLessonIdx,
    currentBlockId
  } = useLessonStore();

  const isB5 = currentBlockId === 'B5';
  const isB7 = currentBlockId === 'B7';
  const isB8 = currentBlockId === 'B8';
  const activeAccent = isB8 ? THEME.b8Accent : isB7 ? THEME.b7Accent : isB5 ? THEME.b5Accent : THEME.accent;
  const activeAccentBg = isB8 ? THEME.b8AccentBg : isB7 ? THEME.b7AccentBg : isB5 ? THEME.b5AccentBg : THEME.accentBg;

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
          <div className={`w-3 h-3 rounded-full ${activeAccentBg} animate-pulse shadow-[0_0_8px_${isB8 ? '#F5F5F5' : isB7 ? '#FF4500' : isB5 ? '#D4AF37' : '#00FF9F'}]`}></div>
          <h1 className={`font-bold tracking-widest text-lg uppercase font-[family-name:var(--font-orbitron)] group-hover:${activeAccent} transition-colors`}>
  Signal to <span className={activeAccent}>shell</span>
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
          <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#00FF9F]/10 rounded-sm">
                  <Info className={`w-6 h-6 ${THEME.accent}`} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-orbitron)] uppercase leading-none">
                  Nexus Intelligence
                </h2>
              </div>

              <div className="space-y-4 text-gray-400 font-[family-name:var(--font-rajdhani)] leading-relaxed text-lg">
                <p>
                  Operative, you are entering the <span className={THEME.accent}>Signal to Shell</span> nexus—a high-fidelity training environment designed to evolve your biological command-line reflexes into an autonomous AI orchestration engine.
                </p>
                <p>
                  This project is a modular journey from <span className="text-white">Zero to Master of the Gemini CLI</span>. You will progress through seven critical blocks, each inspired by the shifting states of consciousness required for high-stakes agentic operations.
                </p>
                <div className={`p-6 border-l-2 border-[#00FF9F] bg-[#00FF9F]/5 rounded-r-sm shadow-[inset_0_0_20px_rgba(0,255,159,0.03)]`}>
                  <p className="text-sm font-mono text-[#00FF9F]">
                    "The shell is not a tool. It is the nervous system of the machine. Mastery is the only path to the Singularity."
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#00FF9F]/10 rounded-sm">
                  <HelpCircle className={`w-6 h-6 ${THEME.accent}`} />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em] font-mono leading-none">
                  Nexus_Navigation
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <LayoutGrid className="w-5 h-5" />, title: "The Deployment Grid", desc: "Select a Deployment Phase from the central hub to initialize a training node." },
                  { icon: <Zap className="w-5 h-5" />, title: "Persistent Link", desc: "Your progress is burned into the neural link. You can return to any completed node to refresh your state." },
                  { icon: <ArrowLeft className="w-5 h-5" />, title: "Exit & Resume", desc: "Use the breadcrumbs or the sidebar logo to switch between the active terminal and the nexus hub." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className={`mt-1 p-2 rounded-sm bg-white/5 ${THEME.accent} border border-white/5 group-hover:border-[#00FF9F]/40 transition-all duration-300 shadow-sm`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1 font-mono uppercase tracking-widest group-hover:text-[#00FF9F] transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 font-[family-name:var(--font-rajdhani)] leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setView('lesson')}
                className={`w-full py-5 border border-[#00FF9F]/60 text-[#00FF9F] font-bold uppercase tracking-[0.3em] text-xs hover:bg-[#00FF9F]/20 transition-all flex items-center justify-center gap-3 font-mono group shadow-[0_0_15px_rgba(0,255,159,0.1)]`}
              >
                ACCESS_ACTIVE_SESSION
                <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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
                          <CheckCircle2 className={`w-4 h-4 ${activeAccent}`} />
                        ) : isCurrent ? (
                          <div className={`w-4 h-4 rounded-full border ${isB8 ? 'border-[#F5F5F5]' : isB7 ? 'border-[#FF4500]' : 'border-[#00FF9F]'} flex items-center justify-center animate-pulse`}>
                            <div className={`w-2 h-2 rounded-full ${isB8 ? 'bg-[#F5F5F5]' : isB7 ? 'bg-[#FF4500]' : 'bg-[#00FF9F]'}`}></div>
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

              {currentLesson.tasks[currentTaskIdx]?.hint && !isSuccess && (
                <div className="mt-4 p-3 bg-[#00D1FF]/5 border-l-2 border-[#00D1FF]/40 rounded-r animate-in fade-in slide-in-from-top-2 duration-700">
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-widest text-[#00D1FF]/70">
                    <Info className="w-3 h-3" /> System Insight
                  </div>
                  <p className="text-[11px] text-[#00D1FF]/90 font-mono italic leading-relaxed">
                    {currentLesson.tasks[currentTaskIdx].hint}
                  </p>
                </div>
              )}
            </div>

            {isSuccess && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-4 rounded border border-[#00FF9F]/30 bg-[#00FF9F]/5 flex flex-col gap-3`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${THEME.accent} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`font-bold ${activeAccent} font-[family-name:var(--font-rajdhani)] text-lg mb-2`}>
                        <DecryptText
                          text={currentLesson.feedback.success}
                          onComplete={() => setDecryptionComplete(true)}
                          className={`font-mono ${activeAccent} drop-shadow-[0_0_5px_${isB8 ? '#F5F5F5' : isB7 ? '#FF4500' : isB5 ? '#D4AF37' : '#00FF9F'}]`}
                        />
                      </p>
                    </div>
                  </div>

                  {decryptionComplete && (
                    <div className="space-y-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
                      {isLastLesson ? (
                        <button
                          onClick={() => setView('dashboard')}
                          className={`w-full py-3 ${THEME.accentBg} text-black font-bold uppercase tracking-tighter text-xs hover:shadow-[0_0_20px_#00FF9F] transition-all font-[family-name:var(--font-rajdhani)] text-sm flex items-center justify-center gap-2`}
                        >
                          Finish Mission & Return to Nexus
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={nextLesson}
                            className={`w-full py-3 ${THEME.accentBg} text-black font-bold uppercase tracking-tighter text-xs hover:shadow-[0_0_20px_#00FF9F] transition-all font-[family-name:var(--font-rajdhani)] text-sm flex items-center justify-center gap-2`}
                          >
                            {LESSONS[currentLessonIdx].blockId !== LESSONS[currentLessonIdx + 1]?.blockId
                              ? 'Continue to Next Phase'
                              : 'Proceed to Next Node'}
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {LESSONS[currentLessonIdx].blockId !== LESSONS[currentLessonIdx + 1]?.blockId && (
                            <button
                              onClick={() => setView('dashboard')}
                              className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all font-mono"
                            >
                              Return to Dashboard
                            </button>
                          )}
                        </>
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
              {LESSONS.filter(l => l.blockId === currentLesson.blockId).map((l) => {
                const globalIdx = LESSONS.findIndex(orig => orig.id === l.id);
                const block = BLOCKS.find(b => b.id === l.blockId);
                const isLocked = globalIdx > maxLessonIdx;
                const isActive = globalIdx === currentLessonIdx;

                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      if (!isLocked) jumpToLesson(globalIdx);
                    }}
                    className={`flex items-center gap-3 p-2 rounded transition-colors ${isLocked ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-white/10'
                      } ${isActive ? 'bg-white/5 border border-[#00FF9F]/20' : ''}`}
                  >
                    <span className={`text-[10px] font-mono ${globalIdx <= currentLessonIdx ? THEME.accent : 'text-gray-600'}`}>
                      {l.id.replace('L', '')}
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-[family-name:var(--font-rajdhani)] font-medium">
                        {l.title.split(': ')[1] || l.title}
                      </span>
                      {isActive && (
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
