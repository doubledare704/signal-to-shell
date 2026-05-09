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
  setVfs: (vfs: VFSState) => void;
  setCurrentPath: (path: string) => void;
  addHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  executeCommand: (input: string) => void;
}

const INITIAL_VFS: VFSState = {
  '/': { type: 'dir', children: ['README.md', 'cyber-nexus'] },
  '/README.md': {
    type: 'file',
    content: '# Welcome to Signal to shell\nStart by exploring the system.',
  },
  '/cyber-nexus': { type: 'dir', children: [] },
};

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
      history: [
        { type: 'system', content: 'SIGNAL OS v1.0.4 - INITIALIZED' },
        { type: 'system', content: 'AUTHORIZED ACCESS DETECTED...' },
        { type: 'system', content: 'Welcome back, Operative.' },
      ],
      setVfs: (vfs) => set({ vfs }),
      setCurrentPath: (path) => set({ currentPath: path }),
      addHistory: (entry) => set((state) => ({ history: [...state.history, entry] })),
      clearHistory: () => set({ history: [] }),
      executeCommand: (input: string) => {
        const fullCmd = input.trim();
        if (!fullCmd) return;

        const [cmd, ...args] = fullCmd.split(/\s+/);
        let output = '';
        
        const state = get();
        const currentPath = state.currentPath;
        const vfs = state.vfs;

        let newHistory = [...state.history, { type: 'input', content: `${currentPath} > ${fullCmd}` } as HistoryEntry];

        switch (cmd) {
          case 'pwd': {
            output = currentPath;
            break;
          }
          case 'ls': {
            const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath;
            const dir = vfs[targetPath];
            if (dir && dir.type === 'dir') {
              output = dir.children.length > 0 ? dir.children.join('  ') : '';
            } else if (dir && dir.type === 'file') {
              output = args[0];
            } else {
              output = `ls: cannot access '${targetPath}': No such file or directory`;
            }
            break;
          }
          case 'cd': {
            if (!args[0] || args[0] === '~') {
              set({ currentPath: '/' });
            } else if (args[0] === '..') {
              const parts = currentPath.split('/').filter(Boolean);
              parts.pop();
              set({ currentPath: '/' + parts.join('/') });
            } else {
              const target = resolvePath(currentPath, args[0]);
              if (vfs[target] && vfs[target].type === 'dir') {
                set({ currentPath: target });
              } else {
                output = `cd: no such directory: ${args[0]}`;
              }
            }
            break;
          }
          case 'mkdir': {
            if (!args[0]) {
              output = 'mkdir: missing operand';
            } else {
              const fullPath = resolvePath(currentPath, args[0]);
              if (vfs[fullPath]) {
                output = `mkdir: cannot create directory '${args[0]}': File exists`;
              } else {
                const parts = fullPath.split('/').filter(Boolean);
                const dirName = parts.pop()!;
                const parentPath = '/' + parts.join('/');

                const parent = vfs[parentPath];
                if (parent && parent.type === 'dir') {
                  const newVfs = { ...vfs };
                  newVfs[fullPath] = { type: 'dir', children: [] };
                  newVfs[parentPath] = {
                    ...parent,
                    children: [...parent.children, dirName],
                  };
                  set({ vfs: newVfs });
                } else {
                  output = `mkdir: cannot create directory '${args[0]}': No such file or directory`;
                }
              }
            }
            break;
          }
          case 'touch': {
            if (!args[0]) {
              output = 'touch: missing file operand';
            } else {
              const fullPath = resolvePath(currentPath, args[0]);
              if (vfs[fullPath]) {
                // update timestamp (not implemented)
              } else {
                const parts = fullPath.split('/').filter(Boolean);
                const fileName = parts.pop()!;
                const parentPath = '/' + parts.join('/');

                const parent = vfs[parentPath];
                if (parent && parent.type === 'dir') {
                  const newVfs = { ...vfs };
                  newVfs[fullPath] = { type: 'file', content: '' };
                  newVfs[parentPath] = {
                    ...parent,
                    children: [...parent.children, fileName],
                  };
                  set({ vfs: newVfs });
                } else {
                  output = `touch: cannot touch '${args[0]}': No such file or directory`;
                }
              }
            }
            break;
          }
          case 'rm': {
            // Simplified rm
            if (!args[0]) {
              output = 'rm: missing operand';
            } else {
              const fullPath = resolvePath(currentPath, args[0]);
              if (!vfs[fullPath]) {
                output = `rm: cannot remove '${args[0]}': No such file or directory`;
              } else if (vfs[fullPath].type === 'dir' && args[1] !== '-r' && args[1] !== '-rf') {
                 // In a real terminal rm -rf is needed, but we keep it simple or require it.
                 output = `rm: cannot remove '${args[0]}': Is a directory`;
              } else {
                const newVfs = { ...vfs };
                // Also remove children if it's a directory
                Object.keys(newVfs).forEach(key => {
                  if (key.startsWith(fullPath)) {
                    delete newVfs[key];
                  }
                });
                delete newVfs[fullPath];
                
                // Remove from parent
                const parts = fullPath.split('/').filter(Boolean);
                const targetName = parts.pop()!;
                const parentPath = '/' + parts.join('/');
                const parent = newVfs[parentPath];
                if (parent && parent.type === 'dir') {
                   newVfs[parentPath] = {
                     ...parent,
                     children: parent.children.filter(c => c !== targetName)
                   };
                }
                set({ vfs: newVfs });
              }
            }
            break;
          }
          case 'cat': {
            if (!args[0]) {
              output = 'cat: missing operand';
            } else {
              const fullPath = resolvePath(currentPath, args[0]);
              if (!vfs[fullPath]) {
                output = `cat: ${args[0]}: No such file or directory`;
              } else if (vfs[fullPath].type === 'dir') {
                output = `cat: ${args[0]}: Is a directory`;
              } else {
                output = vfs[fullPath].content;
              }
            }
            break;
          }
          case 'clear': {
            set({ history: [] });
            return;
          }
          case 'cp': {
            if (!args[0] || !args[1]) {
              output = 'cp: missing file operand';
            } else {
              const srcPath = resolvePath(currentPath, args[0]);
              const destPath = resolvePath(currentPath, args[1]);
              
              if (!vfs[srcPath]) {
                output = `cp: cannot stat '${args[0]}': No such file or directory`;
              } else if (vfs[srcPath].type === 'dir') {
                output = `cp: -r not specified; omitting directory '${args[0]}'`;
              } else {
                let actualDestPath = destPath;
                if (vfs[destPath] && vfs[destPath].type === 'dir') {
                   const srcParts = srcPath.split('/').filter(Boolean);
                   const srcName = srcParts.pop() || '';
                   actualDestPath = resolvePath(destPath, srcName);
                }
                
                const destParts = actualDestPath.split('/').filter(Boolean);
                const destName = destParts.pop()!;
                const destParentPath = '/' + destParts.join('/');
                const destParent = vfs[destParentPath];
                
                if (!destParent || destParent.type !== 'dir') {
                   output = `cp: cannot create regular file '${args[1]}': No such file or directory`;
                } else {
                   const newVfs = { ...vfs };
                   newVfs[actualDestPath] = { ...vfs[srcPath] };
                   if (!destParent.children.includes(destName)) {
                     newVfs[destParentPath] = {
                       ...destParent,
                       children: [...destParent.children, destName]
                     };
                   }
                   set({ vfs: newVfs });
                }
              }
            }
            break;
          }
          case 'mv': {
            if (!args[0] || !args[1]) {
              output = 'mv: missing file operand';
            } else {
              const srcPath = resolvePath(currentPath, args[0]);
              const destPath = resolvePath(currentPath, args[1]);
              
              if (!vfs[srcPath]) {
                output = `mv: cannot stat '${args[0]}': No such file or directory`;
              } else {
                let actualDestPath = destPath;
                if (vfs[destPath] && vfs[destPath].type === 'dir') {
                   const srcParts = srcPath.split('/').filter(Boolean);
                   const srcName = srcParts.pop() || '';
                   actualDestPath = resolvePath(destPath, srcName);
                }
                
                if (srcPath === actualDestPath) {
                  output = `mv: '${args[0]}' and '${args[1]}' are the same file`;
                  break;
                }

                const destParts = actualDestPath.split('/').filter(Boolean);
                const destName = destParts.pop()!;
                const destParentPath = '/' + destParts.join('/');
                const destParent = vfs[destParentPath];
                
                if (!destParent || destParent.type !== 'dir') {
                   output = `mv: cannot move '${args[0]}' to '${args[1]}': No such file or directory`;
                } else {
                   const newVfs = { ...vfs };
                   
                   // Move the node
                   newVfs[actualDestPath] = { ...vfs[srcPath] };
                   delete newVfs[srcPath];

                   // Update children arrays
                   if (!destParent.children.includes(destName)) {
                     newVfs[destParentPath] = {
                       ...destParent,
                       children: [...destParent.children, destName]
                     };
                   }

                   const srcParts = srcPath.split('/').filter(Boolean);
                   const srcName = srcParts.pop()!;
                   const srcParentPath = '/' + srcParts.join('/');
                   const srcParent = newVfs[srcParentPath];
                   if (srcParent && srcParent.type === 'dir') {
                      newVfs[srcParentPath] = {
                        ...srcParent,
                        children: srcParent.children.filter(c => c !== srcName)
                      };
                   }

                   // Move all nested nodes if it's a directory
                   if (vfs[srcPath].type === 'dir') {
                     Object.keys(newVfs).forEach(key => {
                       if (key.startsWith(srcPath + '/')) {
                         const newKey = actualDestPath + key.slice(srcPath.length);
                         newVfs[newKey] = newVfs[key];
                         delete newVfs[key];
                       }
                     });
                   }

                   set({ vfs: newVfs });
                }
              }
            }
            break;
          }
          case 'help': {
            output = 'Available commands: pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, clear, gemini, help';
            break;
          }
          case 'gemini': {
            output = 'GEMINI CLI v0.1: Thinking... (Simulation: Analysis complete. System optimal.)';
            break;
          }
          default: {
            output = `command not found: ${cmd}`;
            break;
          }
        }

        if (output) {
          newHistory.push({ type: 'output', content: output });
        }

        set({ history: newHistory });
      },
    }),
    {
      name: 'signal-shell-vfs',
    }
  )
);
