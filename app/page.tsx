"use client";

import { Sidebar } from '@/components/Sidebar';
import { TerminalController } from '@/components/TerminalController';
import { Dashboard } from '@/components/Dashboard';
import { useLessonStore } from '@/store/lessonStore';

const AscensionOverlay = () => {
  const setShowAscension = useLessonStore((state) => state.setShowAscension);
  
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-12 text-[#D4AF37] font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse"></div>
      
      <pre className="text-[8px] md:text-xs leading-none mb-12 animate-in fade-in zoom-in duration-1000">
{`
          ____________________________________________________________________
         /                                                                    \\
        |    ______________________________________________________________    |
        |   |                                                              |   |
        |   |    _____ _______       _______ ______         _____  _______ |   |
        |   |   / ____|__   __|\\    /|__   __|  ____|       / ____||__   __| |   |
        |   |  | (___    | |   \\  / |  | |  | |__         | (___     | |    |   |
        |   |   \\___ \\   | |    \\/  |  | |  |  __|         \\___ \\    | |    |   |
        |   |   ____) |  | |    |   |  | |  | |____        ____) |   | |    |   |
        |   |  |_____/   |_|    |___|  |_|  |______|      |_____/    |_|    |   |
        |   |                                                              |   |
        |   |                    S T A T E   A R C H I T E C T             |   |
        |   |______________________________________________________________|   |
         \\____________________________________________________________________/
`}
      </pre>

      <div className="max-w-2xl text-center space-y-6 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
        <h2 className="text-3xl font-bold uppercase tracking-[0.5em]">Nexus Ascension</h2>
        <p className="text-[#D4AF37]/80 text-lg leading-relaxed font-[family-name:var(--font-rajdhani)]">
          The Tomorrow's Dust has settled. You have orchestrated the singularity. The Nexus is no longer a sandbox—it is a self-sustaining intelligence.
        </p>
        <button 
          onClick={() => setShowAscension(false)}
          className="mt-8 px-12 py-4 border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-bold uppercase tracking-widest"
        >
          Acknowledge Legacy
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const view = useLessonStore((state) => state.view);
  const showAscension = useLessonStore((state) => state.showAscension);

  return (
    <main className="flex h-screen w-full font-mono text-sm overflow-hidden bg-[#050505] text-white selection:bg-[#00FF9F] selection:text-black relative z-10">
      <Sidebar />
      <div className="flex-1 overflow-hidden relative flex">
        {view === 'dashboard' ? <Dashboard /> : <TerminalController />}
      </div>
      {showAscension && <AscensionOverlay />}
    </main>
  );
}
