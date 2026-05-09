import React, { useState, useEffect } from 'react';
import { Activity, BrainCircuit, TerminalSquare, CheckCircle2 } from 'lucide-react';
import { LogicStep, AgentStatus } from '../store/lessonStore';

interface LogicFeedProps {
  currentStep: LogicStep | null;
  status: AgentStatus;
}

const LogicFeed: React.FC<LogicFeedProps> = ({ currentStep, status }) => {
  const [pulse, setPulse] = useState(false);

  // A deep, hypnotic rhythmic pulse for the 'Thinking' state
  useEffect(() => {
    if (status === 'THINKING') {
      const interval = setInterval(() => setPulse(p => !p), 800); // 75 BPM dub-techno rhythm
      return () => clearInterval(interval);
    }
  }, [status]);

  if (!currentStep) return null;

  return (
    <div className="flex flex-col w-80 h-full border-l border-[#1a1a1a] bg-[#050505] font-mono text-xs overflow-hidden relative">
      
      {/* Background CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a] z-10 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <BrainCircuit className={`w-4 h-4 ${status === 'ERROR' ? 'text-[#FF00FF]' : 'text-[#00D1FF]'}`} />
          <span className="font-bold tracking-widest uppercase text-gray-300">Agent_Logic</span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'THINKING' && (
            <span className={`w-2 h-2 rounded-full bg-[#FF00FF] ${pulse ? 'opacity-100 shadow-[0_0_8px_#FF00FF]' : 'opacity-30'} transition-opacity duration-500`}></span>
          )}
          {status === 'WAITING' && (
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          )}
          {status === 'SUCCESS' && (
            <span className="w-2 h-2 rounded-full bg-[#00FF9F] shadow-[0_0_8px_#00FF9F]"></span>
          )}
        </div>
      </div>

      {/* Logic Stream Body */}
      <div className="p-4 space-y-6 z-10 flex-1 overflow-y-auto scrollbar-hide">
        
        {/* Step 1: The Thought */}
        <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-500">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
            <Activity className="w-3 h-3" />
            <span>Internal State: Thought</span>
          </div>
          <div className="p-3 border border-[#1a1a1a] bg-[#111] rounded text-gray-300 leading-relaxed relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00D1FF]"></div>
            {currentStep.ai_thought.replace('THOUGHT: ', '')}
          </div>
        </div>

        {/* Step 2: Expected Action (The Signal) */}
        <div className={`space-y-2 transition-all duration-700 ${status === 'SUCCESS' ? 'opacity-50' : 'opacity-100'}`}>
           <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
            <TerminalSquare className="w-3 h-3" />
            <span>Required Observation</span>
          </div>
          <div className={`p-3 border border-dashed rounded font-bold tracking-tight transition-colors duration-300
            ${status === 'SUCCESS' 
              ? 'border-[#00FF9F]/30 bg-[#00FF9F]/5 text-[#00FF9F]' 
              : status === 'ERROR'
              ? 'border-[#FF00FF]/50 bg-[#FF00FF]/10 text-[#FF00FF] animate-shake'
              : 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500'
            }`}
          >
            {status === 'SUCCESS' ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Command verified</span>
              </div>
            ) : (
              <span>Awaiting input: `{currentStep.required_command}`</span>
            )}
          </div>
        </div>

        {/* Hints / Glitch Output */}
        {status === 'ERROR' && (
          <div className="p-2 bg-[#FF00FF]/10 text-[#FF00FF] border-l-2 border-[#FF00FF] animate-in slide-in-from-top-1">
            <p className="font-bold mb-1">SIGNAL_MISMATCH</p>
            <p className="text-[10px] opacity-80">{currentStep.hint}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LogicFeed;
