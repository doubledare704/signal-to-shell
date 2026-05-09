import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileNode = {
  type: 'file';
  content: string;
};

export type DirNode = {
  type: 'dir';
  children: string[];
};

export type VFSNode = FileNode | DirNode;

export type VFSState = {
  [path: string]: VFSNode;
};

export type HistoryEntry = {
  type: 'input' | 'system' | 'output';
  content: string;
};

export interface VFSStore {
  vfs: VFSState;
  currentPath: string;
  history: HistoryEntry[];
  currentBlockId: string;
  setVfs: (vfs: VFSState) => void;
  setCurrentPath: (path: string) => void;
  addHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  executeCommand: (input: string) => void;
  initializeForBlock: (blockId: string) => void;
  getAutocomplete: (input: string) => string | null;
}

export const BLOCK_VFS: Record<string, VFSState> = {
  'B1': {
    '/': { type: 'dir', children: ['README.md', 'cyber-nexus'] },
    '/README.md': {
      type: 'file',
      content: '# Welcome to Signal to shell\nStart by exploring the system.',
    },
    '/cyber-nexus': { type: 'dir', children: [] },
  },
  'B2': {
    '/': { type: 'dir', children: ['README.md', 'src', 'legacy', 'MIGRATION.md', 'system.log'] },
    '/README.md': {
      type: 'file',
      content: '# Block 2: The Command Stream\nMaster the flow of signals and manipulate the project architecture.',
    },
    '/MIGRATION.md': {
      type: 'file',
      content: '# Migration Spec\n1. Move /legacy/user-model.py to /core/models/user.py\n2. Move /legacy/api-v1.py to /core/api/v1.py\n3. Ensure /legacy is empty.',
    },
    '/system.log': {
      type: 'file',
      content: '2026-05-09 10:00:01 INFO: System boot\n2026-05-09 10:00:05 ERROR_404: Node mismatch in sector 7\n2026-05-09 10:00:10 INFO: Retrying connection\n2026-05-09 10:00:15 ERROR_404: Authentication failure in sector 9\n2026-05-09 10:00:20 INFO: Signal lost\n2026-05-09 10:00:25 ERROR_404: Core breach detected',
    },
    '/src': { type: 'dir', children: ['app', 'utils'] },
    '/src/app': { type: 'dir', children: ['main.py', 'routes'] },
    '/src/app/main.py': { type: 'file', content: 'import sys\n\ndef main():\n    print("Hello Nexus")\n\nif __name__ == "__main__":\n    main()' },
    '/src/app/routes': { type: 'dir', children: ['api.py'] },
    '/src/app/routes/api.py': { type: 'file', content: 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef index():\n    return "API v1"\n\n# Deepest file task target\n# Line 10\n# Line 11' },
    '/src/utils': { type: 'dir', children: ['helper.py'] },
    '/src/utils/helper.py': { type: 'file', content: 'def help():\n    pass' },
    '/legacy': { type: 'dir', children: ['user-model.py', 'api-v1.py'] },
    '/legacy/user-model.py': { type: 'file', content: 'class User: pass' },
    '/legacy/api-v1.py': { type: 'file', content: 'def api(): pass' },
  }
};

const INITIAL_VFS = BLOCK_VFS['B1'];

const resolvePath = (current: string, target: string) => {
  if (!target) return current;
  const basePath = target.startsWith('/') ? '' : current;
  const parts = `${basePath}/${target}`.split('/').filter(Boolean);
  
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  
  return '/' + resolved.join('/');
};

export const useVFSStore = create<VFSStore>()(
  persist(
    (set, get) => ({
      vfs: INITIAL_VFS,
      currentPath: '/',
      currentBlockId: 'B1',
      history: [
        { type: 'system', content: 'SIGNAL OS v1.0.4 - INITIALIZED' },
        { type: 'system', content: 'AUTHORIZED ACCESS DETECTED...' },
        { type: 'system', content: 'Welcome back, Operative.' },
      ],
      setVfs: (vfs) => set({ vfs }),
      setCurrentPath: (path) => set({ currentPath: path }),
      addHistory: (entry) => set((state) => ({ history: [...state.history, entry] })),
      clearHistory: () => set({ history: [] }),
      initializeForBlock: (blockId: string) => {
        const state = get();
        if (state.currentBlockId !== blockId) {
          const initialVfs = BLOCK_VFS[blockId] || INITIAL_VFS;
          set({
            currentBlockId: blockId,
            vfs: JSON.parse(JSON.stringify(initialVfs)),
            currentPath: '/',
            history: [
              ...state.history,
              { type: 'system', content: `TRANSITIONING TO PHASE: ${blockId}` },
              { type: 'system', content: `VFS RE-INITIALIZED FOR ${blockId}.` }
            ]
          });
        }
      },
      getAutocomplete: (input: string) => {
        const { vfs, currentPath } = get();
        const parts = input.split(/\s+/);
        const lastPart = parts[parts.length - 1];
        
        if (input.endsWith(' ') || !lastPart) return null;

        let searchDir = currentPath;
        let prefix = lastPart;

        if (lastPart.includes('/')) {
          const pathParts = lastPart.split('/');
          prefix = pathParts.pop() || '';
          const dirPart = pathParts.join('/') || (lastPart.startsWith('/') ? '/' : '.');
          searchDir = resolvePath(currentPath, dirPart);
        }

        const node = vfs[searchDir];
        if (node && node.type === 'dir') {
          const matches = node.children.filter(child => child.startsWith(prefix));
          if (matches.length === 1) {
            const match = matches[0];
            const isDir = vfs[resolvePath(searchDir, match)]?.type === 'dir';
            return match.slice(prefix.length) + (isDir ? '/' : '');
          }
        }
        return null;
      },
      executeCommand: (input: string) => {
        const rawInput = input.trim();
        if (!rawInput) return;

        const state = get();
        const vfs = state.vfs;
        const currentPath = state.currentPath;

        let newHistory = [...state.history, { type: 'input', content: `${currentPath} > ${rawInput}` } as HistoryEntry];

        if (rawInput === 'sts-reset') {
          const initialVfs = BLOCK_VFS[state.currentBlockId] || INITIAL_VFS;
          set({ 
            vfs: JSON.parse(JSON.stringify(initialVfs)), 
            currentPath: '/', 
            history: [{ type: 'system', content: `SYSTEM RESET COMPLETE. VFS RESTORED TO ${state.currentBlockId} INITIAL STATE.` }] 
          });
          return;
        }

        // Handle redirection
        let actualInput = rawInput;
        let redirectTarget: string | null = null;
        if (rawInput.includes('>')) {
          const parts = rawInput.split('>');
          actualInput = parts[0].trim();
          redirectTarget = parts[1].trim();
        }

        // Handle pipes
        const pipeCommands = actualInput.split('|').map(s => s.trim());
        let pipeOutput = '';

        for (let i = 0; i < pipeCommands.length; i++) {
          const [cmd, ...args] = pipeCommands[i].split(/\s+/);
          let currentOutput = '';

          switch (cmd) {
            case 'pwd':
              currentOutput = currentPath;
              break;
            case 'ls': {
              const recursive = args.includes('-R');
              const target = args.filter(a => !a.startsWith('-'))[0] || '';
              const targetPath = resolvePath(currentPath, target);
              
              if (recursive) {
                const results: string[] = [];
                const walk = (path: string) => {
                  const node = vfs[path];
                  if (node && node.type === 'dir') {
                    results.push(`${path}:`);
                    results.push(node.children.join('  '));
                    results.push('');
                    node.children.forEach(child => {
                      const childPath = path === '/' ? `/${child}` : `${path}/${child}`;
                      walk(childPath);
                    });
                  }
                };
                walk(targetPath);
                currentOutput = results.join('\n');
              } else {
                const node = vfs[targetPath];
                if (node && node.type === 'dir') {
                  currentOutput = node.children.join('  ');
                } else if (node && node.type === 'file') {
                  currentOutput = target;
                } else {
                  currentOutput = `ls: cannot access '${targetPath}': No such file or directory`;
                }
              }
              break;
            }
            case 'cd': {
              const target = args[0] || '/';
              if (target === '~') {
                set({ currentPath: '/' });
              } else {
                const resolved = resolvePath(currentPath, target);
                if (vfs[resolved] && vfs[resolved].type === 'dir') {
                  set({ currentPath: resolved });
                } else {
                  currentOutput = `cd: no such directory: ${target}`;
                }
              }
              break;
            }
            case 'mkdir': {
              const isRecursive = args.includes('-p');
              const target = args.filter(a => !a.startsWith('-'))[0];
              if (!target) {
                currentOutput = 'mkdir: missing operand';
              } else {
                const fullPath = resolvePath(currentPath, target);
                const parts = fullPath.split('/').filter(Boolean);
                let currentBuild = '';
                const newVfs = { ...get().vfs };

                for (let j = 0; j < parts.length; j++) {
                  const part = parts[j];
                  const parentPath = currentBuild || '/';
                  currentBuild += '/' + part;

                  if (!newVfs[currentBuild]) {
                    if (isRecursive || j === parts.length - 1) {
                      newVfs[currentBuild] = { type: 'dir', children: [] };
                      const parent = newVfs[parentPath] as DirNode;
                      if (!parent.children.includes(part)) {
                        newVfs[parentPath] = { ...parent, children: [...parent.children, part] };
                      }
                    } else {
                      currentOutput = `mkdir: cannot create directory '${target}': No such file or directory`;
                      break;
                    }
                  } else if (newVfs[currentBuild].type === 'file' && j === parts.length - 1) {
                    currentOutput = `mkdir: cannot create directory '${target}': File exists`;
                    break;
                  }
                }
                if (!currentOutput) set({ vfs: newVfs });
              }
              break;
            }
            case 'touch': {
              const target = args[0];
              if (!target) {
                currentOutput = 'touch: missing file operand';
              } else {
                const fullPath = resolvePath(currentPath, target);
                const newVfs = { ...get().vfs };
                if (!newVfs[fullPath]) {
                  const parts = fullPath.split('/').filter(Boolean);
                  const fileName = parts.pop()!;
                  const parentPath = '/' + parts.join('/');
                  const parent = newVfs[parentPath];
                  if (parent && parent.type === 'dir') {
                    newVfs[fullPath] = { type: 'file', content: '' };
                    newVfs[parentPath] = { ...parent, children: [...parent.children, fileName] };
                    set({ vfs: newVfs });
                  } else {
                    currentOutput = `touch: cannot touch '${target}': No such file or directory`;
                  }
                }
              }
              break;
            }
            case 'cat': {
              const target = args[0];
              const content = i === 0 ? (target ? (vfs[resolvePath(currentPath, target)] as FileNode)?.content : '') : pipeOutput;
              if (target && !vfs[resolvePath(currentPath, target)]) {
                currentOutput = `cat: ${target}: No such file or directory`;
              } else {
                currentOutput = content || '';
              }
              break;
            }
            case 'grep': {
              const pattern = args.filter(a => !a.startsWith('-'))[0];
              const target = args.filter(a => !a.startsWith('-'))[1];
              const input = target ? (vfs[resolvePath(currentPath, target)] as FileNode)?.content : pipeOutput;
              if (input) {
                currentOutput = input.split('\n').filter(line => line.includes(pattern)).join('\n');
              }
              break;
            }
            case 'wc': {
              const isLines = args.includes('-l');
              const input = pipeOutput || (args[0] ? (vfs[resolvePath(currentPath, args[0])] as FileNode)?.content : '');
              if (input !== undefined) {
                if (isLines) {
                  currentOutput = input.split('\n').length.toString();
                } else {
                  currentOutput = `${input.split('\n').length} ${input.split(/\s+/).filter(Boolean).length} ${input.length}`;
                }
              }
              break;
            }
            case 'sort': {
              const input = pipeOutput || (args[0] ? (vfs[resolvePath(currentPath, args[0])] as FileNode)?.content : '');
              if (input) {
                currentOutput = input.split('\n').filter(Boolean).sort().join('\n');
              }
              break;
            }
            case 'find': {
              const nameArg = args[args.indexOf('-name') + 1]?.replace(/['"]/g, '');
              const results: string[] = [];
              const walk = (path: string) => {
                const node = vfs[path];
                if (!nameArg || path.endsWith(nameArg)) {
                  results.push(path);
                }
                if (node && node.type === 'dir') {
                  node.children.forEach(child => walk(path === '/' ? `/${child}` : `${path}/${child}`));
                }
              };
              walk(resolvePath(currentPath, args.filter(a => !a.startsWith('-'))[0] || '.'));
              currentOutput = results.join('\n');
              break;
            }
            case 'rm': {
              const recursive = args.includes('-r') || args.includes('-rf');
              const target = args.filter(a => !a.startsWith('-'))[0];
              if (target) {
                const fullPath = resolvePath(currentPath, target);
                if (vfs[fullPath]) {
                  const newVfs = { ...get().vfs };
                  Object.keys(newVfs).forEach(key => {
                    if (key.startsWith(fullPath + '/')) delete newVfs[key];
                  });
                  delete newVfs[fullPath];
                  const parts = fullPath.split('/').filter(Boolean);
                  const name = parts.pop()!;
                  const parentPath = '/' + parts.join('/');
                  const parent = newVfs[parentPath] as DirNode;
                  if (parent) newVfs[parentPath] = { ...parent, children: parent.children.filter(c => c !== name) };
                  set({ vfs: newVfs });
                }
              }
              break;
            }
            case 'cp':
            case 'mv': {
              const src = args[0];
              const dest = args[1];
              if (src && dest) {
                const srcPath = resolvePath(currentPath, src);
                const destPath = resolvePath(currentPath, dest);
                if (vfs[srcPath]) {
                  const newVfs = { ...get().vfs };
                  const node = { ...newVfs[srcPath] };
                  let actualDest = destPath;
                  if (newVfs[destPath]?.type === 'dir') {
                    actualDest = resolvePath(destPath, srcPath.split('/').pop()!);
                  }
                  
                  newVfs[actualDest] = node;
                  if (cmd === 'mv') {
                    delete newVfs[srcPath];
                    const sParts = srcPath.split('/').filter(Boolean);
                    const sName = sParts.pop()!;
                    const sParent = '/' + sParts.join('/');
                    const pNode = newVfs[sParent] as DirNode;
                    if (pNode) newVfs[sParent] = { ...pNode, children: pNode.children.filter(c => c !== sName) };
                  }

                  const dParts = actualDest.split('/').filter(Boolean);
                  const dName = dParts.pop()!;
                  const dParent = '/' + dParts.join('/');
                  const dpNode = newVfs[dParent] as DirNode;
                  if (dpNode && !dpNode.children.includes(dName)) {
                    newVfs[dParent] = { ...dpNode, children: [...dpNode.children, dName] };
                  }
                  set({ vfs: newVfs });
                }
              }
              break;
            }
            case 'clear':
              set({ history: [] });
              return;
            case 'help':
              currentOutput = 'Available commands: pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, grep, wc, sort, find, clear, help';
              break;
            default:
              currentOutput = `command not found: ${cmd}`;
          }
          pipeOutput = currentOutput;
        }

        if (redirectTarget) {
          const fullPath = resolvePath(currentPath, redirectTarget);
          const newVfs = { ...get().vfs };
          const parts = fullPath.split('/').filter(Boolean);
          const fileName = parts.pop()!;
          const parentPath = '/' + parts.join('/');
          const parent = newVfs[parentPath];
          if (parent && parent.type === 'dir') {
            newVfs[fullPath] = { type: 'file', content: pipeOutput };
            if (!parent.children.includes(fileName)) {
              newVfs[parentPath] = { ...parent, children: [...parent.children, fileName] };
            }
            set({ vfs: newVfs });
            pipeOutput = '';
          } else {
            pipeOutput = `bash: ${redirectTarget}: No such file or directory`;
          }
        }

        if (pipeOutput) {
          newHistory.push({ type: 'output', content: pipeOutput });
        }
        set({ history: newHistory });
      },
    }),
    {
      name: 'signal-shell-vfs',
      partialize: (state) => ({
        vfs: state.vfs,
        currentPath: state.currentPath,
        history: state.history,
        currentBlockId: state.currentBlockId
      }),
    }
  )
);
