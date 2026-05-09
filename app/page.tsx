import { Sidebar } from '@/components/Sidebar';
import { TerminalController } from '@/components/TerminalController';

export default function Home() {
  return (
    <main className="flex h-screen w-full font-mono text-sm overflow-hidden bg-[#050505] text-white selection:bg-[#00FF9F] selection:text-black relative z-10">
      <Sidebar />
      <TerminalController />
    </main>
  );
}
