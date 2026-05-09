"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Command, CheckCircle2, FolderTree, FileText, Maximize2 } from 'lucide-react';
import { useLessonStore, LESSONS } from '../store/lessonStore';
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
  const { currentLessonIdx, currentTaskIdx, isSuccess, nextLesson, jumpToLesson } = useLessonStore();
  const vfs = useVFSStore((state) => state.vfs);
  const [decryptionComplete, setDecryptionComplete] = useState(false);

  useEffect(() => {
    if (!isSuccess) {
      setDecryptionComplete(false);
    }
  }, [isSuccess]);

  const currentLesson = LESSONS[currentLessonIdx];

  return (
    <div className={`w-full md:w-1/3 flex flex-col border-r ${THEME.border} ${THEME.surface} font-sans`}>
      <div className={`p-6 border-b ${THEME.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${THEME.accentBg} animate-pulse shadow-[0_0_8px_#00FF9F]`}></div>
          <h1 className="font-bold tracking-widest text-lg uppercase font-[family-name:var(--font-orbitron)]">
            Signal to <span className={THEME.accent}>shell</span>
          </h1>
        </div>
        <Settings className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 rounded text-[10px] border border-[#00FF9F] ${THEME.accent} font-mono`}>
              LEVEL {currentLesson.id.toString().padStart(2, '0')}
            </span>
            <h2 className="text-xl font-semibold tracking-tight font-[family-name:var(--font-rajdhani)]">
              {currentLesson.title}
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
                <button
                  onClick={nextLesson}
                  className={`animate-in slide-in-from-bottom-2 fade-in duration-300 w-full py-2 ${THEME.accentBg} text-black font-bold uppercase tracking-tighter text-xs hover:shadow-[0_0_15px_#00FF9F] transition-all font-[family-name:var(--font-rajdhani)] text-sm`}
                >
                  Proceed to Next Node
                </button>
              )}
            </div>
          </div>
        )}

        {/* File Tree Visualization embedded in Sidebar for Mobile, hidden on Desktop if there's a dedicated side panel */}
        <div className="md:hidden pt-4 border-t border-[#1a1a1a]">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
            Workspace
          </h3>
          <div className="space-y-1 font-mono">
            {Object.entries(vfs).sort((a, b) => a[0].localeCompare(b[0])).map(([path, data]) => {
              const depth = path.split('/').filter(Boolean).length;
              const name = path.split('/').pop() || '/';
              return (
                <div key={path} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 cursor-default transition-colors group" style={{ marginLeft: `${depth * 12}px` }}>
                  {data.type === 'dir' ? (
                    <FolderTree className="w-4 h-4 text-[#00D1FF] opacity-60 group-hover:opacity-100" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                  )}
                  <span className={`text-xs ${data.type === 'dir' ? 'font-medium' : 'text-gray-400'}`}>
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 pt-8">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">
            Course Progress
          </p>
          {LESSONS.map((l, i) => (
            <div
              key={l.id}
              onClick={() => {
                jumpToLesson(i);
              }}
              className={`flex items-center gap-3 p-2 rounded transition-colors cursor-pointer hover:bg-white/10 ${i === currentLessonIdx ? 'bg-white/5' : i < currentLessonIdx ? 'opacity-70' : 'opacity-40'}`}
            >
              <span className={`text-xs font-mono ${i <= currentLessonIdx ? THEME.accent : 'text-gray-600'}`}>
                {l.id.toString().padStart(2, '0')}
              </span>
              <span className="text-sm font-[family-name:var(--font-rajdhani)]">{l.title}</span>
              {i < currentLessonIdx && (
                <CheckCircle2 className={`w-3 h-3 ml-auto ${THEME.accent}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
