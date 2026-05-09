import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DirNode, FileNode, VFSState, VFSStore, useVFSStore } from './vfsStore';

export interface SubTask {
  id: string;
  instruction: string;
  validate: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
  hint: string;
}

export interface Lesson {
  id: string;
  blockId: string;
  title: string;
  description: string;
  example?: string;
  tasks: SubTask[];
  feedback: {
    success: string;
  };
}

export interface Block {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export const BLOCKS: Block[] = [
  {
    id: "B1",
    title: "Block 1: Expectation",
    subtitle: "The Atomic State (Foundation)",
    description: "“Expectation is taking its toll...” Establish the foundation of the digital nexus."
  },
  {
    id: "B2",
    title: "Block 2: Let It Happen",
    subtitle: "The Command Stream (Control)",
    description: "“All this running around... let it happen.” Master the flow of terminal signals."
  },
  {
    id: "B3",
    title: "Block 3: Mind Mischief",
    subtitle: "The Intelligence Signal (Theory)",
    description: "“She remembers my name... but she’s only messing around.” Learn the logic of the AI loop."
  },
  {
    id: "B4",
    title: "Block 4: The Moment",
    subtitle: "The Gemini Protocol (Scale)",
    description: "“In the end, it’s eventual... and it’s right on time.” Experience the protocol at scale."
  },
  {
    id: "B5",
    title: "Block 5: Tomorrow's Dust",
    subtitle: "Agentic Orchestration (Mastery)",
    description: "“There's no use in lying... it's the air that I breathe.” Architect autonomous systems."
  }
];

export const LESSONS: Lesson[] = [
  {
    id: "L1-PWD",
    blockId: "B1",
    title: "Lesson 1: The 'pwd' Command",
    description: "Welcome, Operative. Your first task is to understand where you are. The `pwd` (print working directory) command outputs the absolute path of the current directory.",
    example: "pwd",
    tasks: [
      {
        id: "T1",
        instruction: "Run the `pwd` command.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history[history.length - 1];
          const lastInput = history.filter(h => h.type === 'input').pop();
          return !!(lastInput && lastInput.content.endsWith('> pwd')) && !!(lastOutput && lastOutput.content === '/');
        },
        hint: "Use the command to verify your current nexus coordinates. Example: 'pwd'"
      }
    ],
    feedback: {
      success: "✓ SIGNAL_ESTABLISHED. You are currently at the root of the nexus."
    }
  },
  {
    id: "L2-LS",
    blockId: "B1",
    title: "Lesson 2: The 'ls' Command",
    description: "Now that you know where you are, let's see what is around you. The `ls` (list) command shows the contents of the current directory.",
    example: "ls",
    tasks: [
      {
        id: "T1",
        instruction: "List the contents of the current directory.",
        validate: (vfs, history, currentPath) => {
          const lastInput = history.filter(h => h.type === 'input').pop();
          return !!lastInput && lastInput.content.endsWith('> ls');
        },
        hint: "Scan the local environment for available nodes. Example: 'ls'"
      }
    ],
    feedback: {
      success: "✓ VISUALS_ONLINE. Directory contents displayed."
    }
  },
  {
    id: "L3-CD",
    blockId: "B1",
    title: "Lesson 3: The 'cd' Command",
    description: "You see the 'cyber-nexus' directory. Let's enter it. The `cd` (change directory) command allows you to navigate the file system.",
    example: "cd cyber-nexus",
    tasks: [
      {
        id: "T1",
        instruction: "Navigate into the 'cyber-nexus' directory.",
        validate: (vfs, history, currentPath) => {
          return currentPath === '/cyber-nexus';
        },
        hint: "Change your focus to a sub-directory. Example: 'cd documents'"
      }
    ],
    feedback: {
      success: "✓ ACCESS_GRANTED. You have entered the nexus."
    }
  },
  {
    id: "L4-MKDIR",
    blockId: "B1",
    title: "Lesson 4: The 'mkdir' Command",
    description: "An operative needs a place to store data. The `mkdir` (make directory) command creates a new folder.",
    example: "mkdir logs",
    tasks: [
      {
        id: "T1",
        instruction: "Create a directory named 'logs' inside 'cyber-nexus'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/cyber-nexus/logs']?.type === 'dir';
        },
        hint: "Initialize a new data storage node. Example: 'mkdir archive'"
      }
    ],
    feedback: {
      success: "✓ STRUCTURE_CREATED. 'logs' directory is ready."
    }
  },
  {
    id: "L5-TOUCH",
    blockId: "B1",
    title: "Lesson 5: The 'touch' Command",
    description: "Let's create an empty file. The `touch` command creates a new, empty file if it doesn't exist.",
    example: "touch session.log",
    tasks: [
      {
        id: "T1",
        instruction: "Navigate into the 'logs' directory.",
        validate: (vfs, history, currentPath) => {
          return currentPath === '/cyber-nexus/logs';
        },
        hint: "Enter the target storage node. Example: 'cd system'"
      },
      {
        id: "T2",
        instruction: "Create a file named 'session.log'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/cyber-nexus/logs/session.log']?.type === 'file';
        },
        hint: "Initialize a fresh signal record. Example: 'touch output.txt'"
      }
    ],
    feedback: {
      success: "✓ FILE_INITIALIZED. 'session.log' is ready to receive data."
    }
  },
  {
    id: "L6-RM",
    blockId: "B1",
    title: "Lesson 6: The 'rm' Command",
    description: "Sometimes data needs to be purged. The `rm` (remove) command deletes files.",
    example: "rm session.log",
    tasks: [
      {
        id: "T1",
        instruction: "Remove the 'session.log' file.",
        validate: (vfs, history, currentPath) => {
          // Verify it was created first, then removed
          const lastInput = history.filter(h => h.type === 'input').pop();
          return vfs['/cyber-nexus/logs/session.log'] === undefined && !!lastInput && lastInput.content.includes('rm session.log');
        },
        hint: "Terminate an unwanted data node. Example: 'rm cache.tmp'"
      }
    ],
    feedback: {
      success: "✓ DATA_PURGED. The file has been removed."
    }
  },
  {
    id: "L7-CP",
    blockId: "B1",
    title: "Lesson 7: The 'cp' Command",
    description: "Let's back up some data. The `cp` (copy) command copies files or directories.",
    example: "cp README.md README-backup.md",
    tasks: [
      {
        id: "T1",
        instruction: "Navigate back to the root directory.",
        validate: (vfs, history, currentPath) => {
          return currentPath === '/';
        },
        hint: "Retract your focus to the root nexus. Example: 'cd /'"
      },
      {
        id: "T2",
        instruction: "Copy 'README.md' to 'README-backup.md'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/README-backup.md']?.type === 'file';
        },
        hint: "Duplicate a signal to a new location. Example: 'cp config.sys config.bak'"
      }
    ],
    feedback: {
      success: "✓ BACKUP_COMPLETE. File duplicated."
    }
  },
  {
    id: "L8-MV",
    blockId: "B1",
    title: "Lesson 8: The 'mv' Command",
    description: "Sometimes files need a new name or location. The `mv` (move) command renames or moves files.",
    example: "mv README-backup.md README-old.md",
    tasks: [
      {
        id: "T1",
        instruction: "Rename 'README-backup.md' to 'README-old.md'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/README-old.md']?.type === 'file' && vfs['/README-backup.md'] === undefined;
        },
        hint: "Relocate or re-label a data stream. Example: 'mv data.raw data.processed'"
      }
    ],
    feedback: {
      success: "✓ FILE_RENAMED. The basic training is now complete, Operative."
    }
  },
  {
    id: "L2-1-SENSORY",
    blockId: "B2",
    title: "Lesson 2.1: Sensory Input",
    description: "Master the art of environmental scanning. In complex systems, you must visualize the entire hierarchy to understand the state. Use recursive tools to map the nexus.",
    example: "find /src | wc -l",
    tasks: [
      {
        id: "T1",
        instruction: "Identify the deepest nested file in the '/src' directory and output its line count using a pipe.",
        validate: (vfs, history, currentPath) => {
          const lastOutput = history[history.length - 1];
          const lastInput = history.filter(h => h.type === 'input').pop();
          // Check for find/ls -R and wc -l in a pipe
          const isPipe = lastInput?.content.includes('|') && lastInput?.content.includes('wc -l');
          const isTarget = lastInput?.content.includes('api.py');
          const correctCount = lastOutput?.content === '11';
          return !!(isPipe && isTarget && correctCount);
        },
        hint: "Discover the architecture's depth and quantify its complexity. Example: 'find . -name \"*.txt\" | wc -l'"
      }
    ],
    feedback: {
      success: "✓ SCAN_COMPLETE. Deep state context acquired."
    }
  },
  {
    id: "L2-2-STRUCTURAL",
    blockId: "B2",
    title: "Lesson 2.2: Structural Integrity",
    description: "Legacy code is noise. Mutate the file system architecture to align with modern standards. Follow the 'MIGRATION.md' spec to reorganize the nexus.",
    example: "mkdir -p core/models && mv legacy/user.py core/models/",
    tasks: [
      {
        id: "T1",
        instruction: "Reorganize the '/legacy' folder into a modern '/core' structure as defined in 'MIGRATION.md'.",
        validate: (vfs, history, currentPath) => {
          const hasUser = vfs['/core/models/user.py']?.type === 'file';
          const hasApi = vfs['/core/api/v1.py']?.type === 'file';
          const legacyEmpty = vfs['/legacy']?.type === 'dir' && (vfs['/legacy'] as DirNode).children.length === 0;
          return hasUser && hasApi && legacyEmpty;
        },
        hint: "Restructure the system using recursive creation and relocation. Example: 'mkdir -p project/src && mv old.js project/src/'"
      }
    ],
    feedback: {
      success: "✓ ARCHITECTURE_MUTATED. Structural integrity verified."
    }
  },
  {
    id: "L2-3-FILTER",
    blockId: "B2",
    title: "Lesson 2.3: Noise Reduction",
    description: "The system is flooded with noise. Distill the data stream to find critical errors. Use pipes, filters, and redirection to archive the signal.",
    example: "grep ERROR system.log | sort > errors.log",
    tasks: [
      {
        id: "T1",
        instruction: "Extract all lines containing 'ERROR_404' from 'system.log', sort them by timestamp, and save to 'distilled_errors.log'.",
        validate: (vfs, history, currentPath) => {
          const file = vfs['/distilled_errors.log'] as FileNode;
          if (!file) return false;
          const lines = file.content.split('\n').filter(Boolean);
          const hasErrors = lines.every(l => l.includes('ERROR_404'));
          const isSorted = lines.length === 3 && lines[0].includes('sector 7') && lines[2].includes('detected');
          return hasErrors && isSorted;
        },
        hint: "Filter, organize, and archive specific signal patterns. Example: 'cat app.log | grep WARN | sort > results.txt'"
      }
    ],
    feedback: {
      success: "✓ SIGNAL_DISTILLED. Decryption protocol initiated. YOU ARE NOW READY TO INTERACT WITH THE INTELLIGENCE SIGNAL."
    }
  },
  {
    id: "L2-4-INSENSITIVE",
    blockId: "B2",
    title: "Lesson 2.4: Pattern Recognition",
    description: "The system logs are inconsistent. Scan for critical signatures regardless of their casing. Mastery of the case-insensitive signal is paramount.",
    example: "grep -i 'pattern' file.log",
    tasks: [
      {
        id: "T1",
        instruction: "Search 'system.log' for all occurrences of 'error' (case-insensitive) and output them to the terminal.",
        validate: (vfs, history, currentPath) => {
          const lastInput = history.filter(h => h.type === 'input').pop();
          const lastOutput = history.filter(h => h.type === 'output').pop();
          const isGrepI = lastInput?.content.includes('grep -i') && lastInput?.content.includes('error');
          const hasResults = lastOutput?.content.toLowerCase().includes('error_404') && 
                            lastOutput?.content.split('\n').filter(Boolean).length >= 3;
          return !!(isGrepI && hasResults);
        },
        hint: "Ignore the variance in signal casing to capture all matches. Example: 'grep -i \"debug\" app.log'"
      }
    ],
    feedback: {
      success: "✓ PATTERN_RECOGNIZED. Inconsistencies accounted for."
    }
  },
  {
    id: "L2-5-RECURSIVE",
    blockId: "B2",
    title: "Lesson 2.5: Recursive Audit",
    description: "Deep intelligence requires deep scanning. Audit the entire source tree for specific protocol versions. Traverse the hierarchy recursively.",
    example: "grep -r 'signal' src/",
    tasks: [
      {
        id: "T1",
        instruction: "Perform a recursive search for the string 'API v1' within the entire '/src' directory.",
        validate: (vfs, history, currentPath) => {
          const lastInput = history.filter(h => h.type === 'input').pop();
          const lastOutput = history.filter(h => h.type === 'output').pop();
          const isRecursive = (lastInput?.content.includes('grep -r') || lastInput?.content.includes('grep -R')) && 
                             lastInput?.content.includes('API v1');
          const hasMatch = lastOutput?.content.includes('/src/app/routes/api.py');
          return !!(isRecursive && hasMatch);
        },
        hint: "Scan through all nested nodes in a directory branch. Example: 'grep -r \"FIXME\" project/'"
      }
    ],
    feedback: {
      success: "✓ AUDIT_COMPLETE. All nodes verified. Block 2 finalized."
    }
  }
];

interface LessonStore {
  currentLessonIdx: number;
  maxLessonIdx: number;
  completedLessonIds: string[];
  currentTaskIdx: number;
  isSuccess: boolean;
  isDecrypting: boolean;
  view: 'dashboard' | 'lesson';
  currentBlockId: string;
  setCurrentLessonIdx: (idx: number) => void;
  setCurrentTaskIdx: (idx: number) => void;
  setIsSuccess: (success: boolean) => void;
  setIsDecrypting: (isDecrypting: boolean) => void;
  setView: (view: 'dashboard' | 'lesson') => void;
  setCurrentBlockId: (id: string) => void;
  nextLesson: () => void;
  jumpToLesson: (idx: number) => void;
  validateCurrentTask: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      currentLessonIdx: 0,
      maxLessonIdx: 0,
      completedLessonIds: [],
      currentTaskIdx: 0,
      isSuccess: false,
      isDecrypting: false,
      view: 'dashboard',
      currentBlockId: 'B1',
      setCurrentLessonIdx: (idx) => {
        const state = get();
        // Only allow selecting lessons that have been reached
        if (idx >= 0 && idx <= state.maxLessonIdx && idx < LESSONS.length) {
          const lesson = LESSONS[idx];
          // Sync VFS if block changed
          const vfsStore = (useVFSStore as any).getState();
          if (vfsStore.currentBlockId !== lesson.blockId) {
            vfsStore.initializeForBlock(lesson.blockId);
          }

          set({
            currentLessonIdx: idx,
            currentBlockId: lesson.blockId,
            currentTaskIdx: 0,
            isSuccess: false,
            view: 'lesson',
            isDecrypting: false
          });
        }
      },
      setCurrentTaskIdx: (idx) => set({ currentTaskIdx: idx }),
      setIsSuccess: (success) => {
        const state = get();
        let newCompleted = state.completedLessonIds;
        if (success) {
          const lessonId = LESSONS[state.currentLessonIdx].id;
          if (!newCompleted.includes(lessonId)) {
            newCompleted = [...newCompleted, lessonId];
          }
        }
        set({ isSuccess: success, completedLessonIds: newCompleted });
      },
      setIsDecrypting: (isDecrypting) => set({ isDecrypting }),
      setView: (view) => set({ view }),
      setCurrentBlockId: (id) => set({ currentBlockId: id }),
      nextLesson: () => {
        const state = get();
        if (state.currentLessonIdx < LESSONS.length - 1) {
          const nextIdx = state.currentLessonIdx + 1;
          const currentId = LESSONS[state.currentLessonIdx].id;
          const newCompleted = state.completedLessonIds.includes(currentId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, currentId];

          const nextLesson = LESSONS[nextIdx];
          // Sync VFS if block changed
          const vfsStore = (useVFSStore as any).getState();
          if (vfsStore.currentBlockId !== nextLesson.blockId) {
            vfsStore.initializeForBlock(nextLesson.blockId);
          }

          set({
            currentLessonIdx: nextIdx,
            currentBlockId: nextLesson.blockId,
            currentTaskIdx: 0,
            isSuccess: false,
            maxLessonIdx: Math.max(state.maxLessonIdx, nextIdx),
            completedLessonIds: newCompleted,
            isDecrypting: false,
          });
        }
      },
      jumpToLesson: (idx) => {
        const state = get();
        // Only allow jumping back to completed lessons or the current furthest reached lesson
        if (idx >= 0 && idx <= state.maxLessonIdx && idx < LESSONS.length) {
          const lesson = LESSONS[idx];
          // Sync VFS if block changed
          const vfsStore = (useVFSStore as any).getState();
          if (vfsStore.currentBlockId !== lesson.blockId) {
            vfsStore.initializeForBlock(lesson.blockId);
          }

          set({
            currentLessonIdx: idx,
            currentBlockId: lesson.blockId,
            currentTaskIdx: 0,
            isSuccess: false,
            isDecrypting: false,
            view: 'lesson'
          });
        }
      },
      validateCurrentTask: (vfs, history, currentPath) => {
        const state = get();
        const currentLesson = LESSONS[state.currentLessonIdx];
        if (!currentLesson) return false;

        const currentTask = currentLesson.tasks[state.currentTaskIdx];
        if (!currentTask) return false;

        if (currentTask.validate(vfs, history, currentPath)) {
          // Task completed!
          if (state.currentTaskIdx < currentLesson.tasks.length - 1) {
            set({ currentTaskIdx: state.currentTaskIdx + 1 });
            return false; // Not lesson complete, just task complete
          } else {
            // Lesson complete!
            if (!state.isSuccess) {
              const lessonId = currentLesson.id;
              const newCompleted = state.completedLessonIds.includes(lessonId)
                ? state.completedLessonIds
                : [...state.completedLessonIds, lessonId];

              set({
                isSuccess: true,
                isDecrypting: true,
                completedLessonIds: newCompleted,
                maxLessonIdx: Math.max(state.maxLessonIdx, state.currentLessonIdx + 1)
              });
              return true;
            }
          }
        }
        return false;
      }
    }),
    {
      name: 'signal-shell-lesson',
      partialize: (state) => ({
        currentLessonIdx: state.currentLessonIdx,
        maxLessonIdx: state.maxLessonIdx,
        completedLessonIds: state.completedLessonIds,
        currentTaskIdx: state.currentTaskIdx,
        view: state.view,
        currentBlockId: state.currentBlockId
      }),
    }
  )
);
