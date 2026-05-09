"use client";

import { Sidebar } from '@/components/Sidebar';
import { TerminalController } from '@/components/TerminalController';
import { Dashboard } from '@/components/Dashboard';
import { useLessonStore } from '@/store/lessonStore';

export default function Home() {
  const view = useLessonStore((state) => state.view);

  return (
    <main className="flex h-screen w-full font-mono text-sm overflow-hidden bg-[#050505] text-white selection:bg-[#00FF9F] selection:text-black relative z-10">
      <Sidebar />
      <div className="flex-1 overflow-hidden relative flex">
        {view === 'dashboard' ? <Dashboard /> : <TerminalController />}
      </div>
    </main>
  );
}
