import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  FolderTree,
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Globe,
  Eye,
  Command,
  Maximize2,
  Settings,
} from 'lucide-react';

// --- THEME & CONSTANTS ---
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

// --- INITIAL STATE ---
const INITIAL_VFS = {
  '/': { type: 'dir', children: ['README.md', 'signal-shell'] },
  '/README.md': {
    type: 'file',
    content: '# Welcome to Signal to shell\nStart by exploring the system.',
  },
  '/signal-shell': { type: 'dir', children: [] },
};

const LESSONS = [
  {
    id: 1,
    title: 'The Digital Foundation',
    description:
      "Welcome, Operative. First, we must initialize your workspace. Create a directory named 'logs' inside 'signal-shell' to track system activity.",
    task: 'Run: mkdir signal-shell/logs',
    check: (vfs) => vfs['/signal-shell/logs']?.type === 'dir',
  },
  {
    id: 2,
    title: 'The Ghost in the Machine',
    description:
      "Structure is key. Now create a file named 'session.log' inside that new directory.",
    task: 'Run: touch signal-shell/logs/session.log',
    check: (vfs) => vfs['/signal-shell/logs/session.log']?.type === 'file',
  },
];

const App = () => {
  const [vfs, setVfs] = useState(INITIAL_VFS);
  const [currentPath, setCurrentPath] = useState('/');
  const [history, setHistory] = useState([
    { type: 'system', content: 'SIGNAL OS v1.0.4 - INITIALIZED' },
    { type: 'system', content: 'AUTHORIZED ACCESS DETECTED...' },
    { type: 'system', content: 'Welcome back, Operative.' },
  ]);
  const [input, setInput] = useState('');
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const currentLesson = LESSONS[currentLessonIdx];

  // Helper to resolve paths
  const resolvePath = (path) => {
    if (path === '/') return '/';
    if (path.startsWith('/')) return path.replace(/\/+$/, '') || '/';
    const base = currentPath === '/' ? '' : currentPath;
    return `${base}/${path}`.replace(/\/+$/, '') || '/';
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Check lesson success whenever VFS changes
  useEffect(() => {
    if (currentLesson.check(vfs)) {
      setIsSuccess(true);
    }
  }, [vfs, currentLesson]);

  // Command Parser
  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;

    const fullCmd = input.trim();
    if (!fullCmd) return;

    const [cmd, ...args] = fullCmd.split(/\s+/);
    let output = '';
    let newHistory = [
      ...history,
      { type: 'input', content: `${currentPath} > ${fullCmd}` },
    ];

    switch (cmd) {
      case 'ls':
        const dir = vfs[currentPath];
        if (dir && dir.children) {
          output = dir.children.length > 0 ? dir.children.join('  ') : '';
        } else {
          output = `ls: cannot access '${currentPath}': No such directory`;
        }
        break;
      case 'cd':
        if (!args[0] || args[0] === '~') {
          setCurrentPath('/');
        } else if (args[0] === '..') {
          const parts = currentPath.split('/').filter(Boolean);
          parts.pop();
          setCurrentPath('/' + parts.join('/'));
        } else {
          const target = resolvePath(args[0]);
          if (vfs[target] && vfs[target].type === 'dir') {
            setCurrentPath(target);
          } else {
            output = `cd: no such directory: ${args[0]}`;
          }
        }
        break;
      case 'mkdir':
        if (!args[0]) {
          output = 'mkdir: missing operand';
        } else {
          const fullPath = resolvePath(args[0]);
          if (vfs[fullPath]) {
            output = `mkdir: cannot create directory '${args[0]}': File exists`;
          } else {
            const parts = fullPath.split('/').filter(Boolean);
            const dirName = parts.pop();
            const parentPath = '/' + parts.join('/');

            if (vfs[parentPath] && vfs[parentPath].type === 'dir') {
              setVfs((prev) => ({
                ...prev,
                [fullPath]: { type: 'dir', children: [] },
                [parentPath]: {
                  ...prev[parentPath],
                  children: [...(prev[parentPath].children || []), dirName],
                },
              }));
            } else {
              output = `mkdir: cannot create directory '${args[0]}': No such file or directory`;
            }
          }
        }
        break;
      case 'touch':
        if (!args[0]) {
          output = 'touch: missing file operand';
        } else {
          const fullPath = resolvePath(args[0]);
          if (vfs[fullPath]) {
            // update timestamp (not implemented, just do nothing)
          } else {
            const parts = fullPath.split('/').filter(Boolean);
            const fileName = parts.pop();
            const parentPath = '/' + parts.join('/');

            if (vfs[parentPath] && vfs[parentPath].type === 'dir') {
              setVfs((prev) => ({
                ...prev,
                [fullPath]: { type: 'file', content: '' },
                [parentPath]: {
                  ...prev[parentPath],
                  children: [...(prev[parentPath].children || []), fileName],
                },
              }));
            } else {
              output = `touch: cannot touch '${args[0]}': No such file or directory`;
            }
          }
        }
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'help':
        output = 'Available commands: ls, cd, mkdir, touch, clear, gemini, help';
        break;
      case 'gemini':
        output =
          'GEMINI CLI v0.1: Thinking... (Simulation: Analysis complete. System optimal.)';
        break;
      default:
        output = `command not found: ${cmd}`;
    }

    if (output) {
      newHistory.push({ type: 'output', content: output });
    }

    setHistory(newHistory);
    setInput('');
  };

  const nextLesson = () => {
    if (currentLessonIdx < LESSONS.length - 1) {
      setCurrentLessonIdx((prev) => prev + 1);
      setIsSuccess(false);
      setHistory((prev) => [
        ...prev,
        {
          type: 'system',
          content: `LEVEL UP: Proceeding to Level ${currentLessonIdx + 2}`,
        },
      ]);
    }
  };

  return (
    <div
      className={`flex h-screen w-full font-mono text-sm overflow-hidden ${THEME.bg} text-white selection:bg-[#00FF9F] selection:text-black`}
    >
      {/* --- SIDEBAR: CONTENT & PROGRESS --- */}
      <div
        className={`w-1/3 flex flex-col border-r ${THEME.border} ${THEME.surface}`}
      >
        <div
          className={`p-6 border-b ${THEME.border} flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${THEME.accentBg} animate-pulse shadow-[0_0_8px_#00FF9F]`}
            ></div>
            <h1 className="font-bold tracking-widest text-lg uppercase">
              Signal to <span className={THEME.accent}>shell</span>
            </h1>
          </div>
          <Settings className="w-4 h-4 text-gray-600 cursor-pointer hover:text-white transition-colors" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-0.5 rounded text-[10px] border border-[#00FF9F] ${THEME.accent}`}
              >
                LEVEL {currentLesson.id.toString().padStart(2, '0')}
              </span>
              <h2 className="text-xl font-semibold tracking-tight">
                {currentLesson.title}
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {currentLesson.description}
            </p>

            <div
              className={`p-4 rounded border border-dashed border-[#1a1a1a] bg-black/50 group`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <Command className="w-3 h-3" /> Objective
              </div>
              <code className={`${THEME.accent} block text-xs`}>
                {currentLesson.task}
              </code>
            </div>
          </div>

          {isSuccess && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div
                className={`p-4 rounded border border-[#00FF9F]/30 bg-[#00FF9F]/5 flex items-start gap-3`}
              >
                <CheckCircle2
                  className={`w-5 h-5 ${THEME.accent} shrink-0 mt-0.5`}
                />
                <div>
                  <p className={`font-bold ${THEME.accent}`}>
                    Task Synchronized
                  </p>
                  <p className="text-xs text-gray-400 mt-1 mb-3">
                    Environment state matches objective. Ready for data
                    injection.
                  </p>
                  <button
                    onClick={nextLesson}
                    className={`w-full py-2 ${THEME.accentBg} text-black font-bold uppercase tracking-tighter text-xs hover:opacity-90 transition-all`}
                  >
                    Proceed to Next Node
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-8">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">
              Course Progress
            </p>
            {LESSONS.map((l, i) => (
              <div
                key={l.id}
                className={`flex items-center gap-3 p-2 rounded transition-colors ${
                  i === currentLessonIdx ? 'bg-white/5' : 'opacity-40'
                }`}
              >
                <span
                  className={`text-xs ${
                    i <= currentLessonIdx ? THEME.accent : 'text-gray-600'
                  }`}
                >
                  {l.id.toString().padStart(2, '0')}
                </span>
                <span className="text-xs">{l.title}</span>
                {i < currentLessonIdx && (
                  <CheckCircle2 className={`w-3 h-3 ml-auto ${THEME.accent}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MAIN AREA: TERMINAL & FILE TREE --- */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 overflow-hidden">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>

        <div
          className={`h-14 border-b ${THEME.border} flex items-center justify-between px-6 ${THEME.surface}`}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Terminal className={`w-4 h-4 ${THEME.accent}`} />
              <span className="text-xs font-bold uppercase tracking-widest">
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
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Terminal */}
          <div
            className="flex-1 flex flex-col p-6 overflow-hidden relative"
            onClick={() => inputRef.current?.focus()}
          >
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-1 mb-4 scrollbar-hide"
            >
              {history.map((line, i) => (
                <div
                  key={i}
                  className={`leading-relaxed break-all ${
                    line.type === 'input'
                      ? 'text-white font-bold'
                      : line.type === 'system'
                      ? THEME.info
                      : line.type === 'output'
                      ? 'text-gray-300'
                      : ''
                  }`}
                >
                  {line.content}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className={THEME.accent}>
                  {currentPath} {'>'}
                </span>
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  className="flex-1 bg-transparent border-none outline-none text-white caret-[#00FF9F]"
                />
              </div>
            </div>
          </div>

          {/* Side File Tree (Visual) */}
          <div
            className={`w-64 border-l ${THEME.border} ${THEME.surface} p-4 hidden md:block overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Workspace
              </h3>
              <Maximize2 className="w-3 h-3 text-gray-600" />
            </div>
            <div className="space-y-1">
              {Object.entries(vfs)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([path, data]) => {
                  const depth = path.split('/').filter(Boolean).length;
                  const name = path.split('/').pop() || '/';
                  return (
                    <div
                      key={path}
                      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 cursor-default transition-colors group"
                      style={{ marginLeft: `${depth * 12}px` }}
                    >
                      {data.type === 'dir' ? (
                        <FolderTree className="w-4 h-4 text-[#00D1FF] opacity-60 group-hover:opacity-100" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                      )}
                      <span
                        className={`text-xs ${
                          data.type === 'dir' ? 'font-medium' : 'text-gray-400'
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER STATUS BAR --- */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-6 border-t ${THEME.border} ${THEME.surface} z-50 flex items-center justify-between px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest`}
      >
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Node: localhost
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            Ping: 24ms
          </div>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span className={THEME.accent}>Connection: Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default App;
