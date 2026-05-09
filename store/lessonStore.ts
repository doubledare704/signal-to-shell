import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VFSState, VFSStore } from './vfsStore';

export interface SubTask {
  id: string;
  instruction: string;
  validate: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  example?: string;
  tasks: SubTask[];
  feedback: {
    success: string;
  };
}

export const LESSONS: Lesson[] = [
  {
    id: "L1-PWD",
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
        hint: "Type 'pwd' and press Enter."
      }
    ],
    feedback: {
      success: "✓ SIGNAL_ESTABLISHED. You are currently at the root of the nexus."
    }
  },
  {
    id: "L2-LS",
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
        hint: "Type 'ls' and press Enter."
      }
    ],
    feedback: {
      success: "✓ VISUALS_ONLINE. Directory contents displayed."
    }
  },
  {
    id: "L3-CD",
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
        hint: "Type 'cd cyber-nexus'."
      }
    ],
    feedback: {
      success: "✓ ACCESS_GRANTED. You have entered the nexus."
    }
  },
  {
    id: "L4-MKDIR",
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
        hint: "Make sure you are in 'cyber-nexus' and type 'mkdir logs'."
      }
    ],
    feedback: {
      success: "✓ STRUCTURE_CREATED. 'logs' directory is ready."
    }
  },
  {
    id: "L5-TOUCH",
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
        hint: "Type 'cd logs'."
      },
      {
        id: "T2",
        instruction: "Create a file named 'session.log'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/cyber-nexus/logs/session.log']?.type === 'file';
        },
        hint: "Type 'touch session.log'."
      }
    ],
    feedback: {
      success: "✓ FILE_INITIALIZED. 'session.log' is ready to receive data."
    }
  },
  {
    id: "L6-RM",
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
        hint: "Type 'rm session.log'."
      }
    ],
    feedback: {
      success: "✓ DATA_PURGED. The file has been removed."
    }
  },
  {
    id: "L7-CP",
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
        hint: "Type 'cd /' or 'cd ..' twice."
      },
      {
        id: "T2",
        instruction: "Copy 'README.md' to 'README-backup.md'.",
        validate: (vfs, history, currentPath) => {
          return vfs['/README-backup.md']?.type === 'file';
        },
        hint: "Type 'cp README.md README-backup.md'."
      }
    ],
    feedback: {
      success: "✓ BACKUP_COMPLETE. File duplicated."
    }
  },
  {
    id: "L8-MV",
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
        hint: "Type 'mv README-backup.md README-old.md'."
      }
    ],
    feedback: {
      success: "✓ FILE_RENAMED. The basic training is now complete, Operative."
    }
  }
];

interface LessonStore {
  currentLessonIdx: number;
  currentTaskIdx: number;
  isSuccess: boolean;
  isDecrypting: boolean;
  setCurrentLessonIdx: (idx: number) => void;
  setCurrentTaskIdx: (idx: number) => void;
  setIsSuccess: (success: boolean) => void;
  setIsDecrypting: (isDecrypting: boolean) => void;
  nextLesson: () => void;
  jumpToLesson: (idx: number) => void;
  validateCurrentTask: (vfs: VFSState, history: VFSStore['history'], currentPath: string) => boolean;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      currentLessonIdx: 0,
      currentTaskIdx: 0,
      isSuccess: false,
      isDecrypting: false,
      setCurrentLessonIdx: (idx) => set({ currentLessonIdx: idx, currentTaskIdx: 0, isSuccess: false }),
      setCurrentTaskIdx: (idx) => set({ currentTaskIdx: idx }),
      setIsSuccess: (success) => set({ isSuccess: success }),
      setIsDecrypting: (isDecrypting) => set({ isDecrypting }),
      nextLesson: () => {
        const state = get();
        if (state.currentLessonIdx < LESSONS.length - 1) {
          set({
            currentLessonIdx: state.currentLessonIdx + 1,
            currentTaskIdx: 0,
            isSuccess: false,
            isDecrypting: false,
          });
        }
      },
      jumpToLesson: (idx) => {
        if (idx >= 0 && idx < LESSONS.length) {
          set({
            currentLessonIdx: idx,
            currentTaskIdx: 0,
            isSuccess: false,
            isDecrypting: false,
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
                 set({ isSuccess: true, isDecrypting: true });
                 return true;
              }
           }
        }
        return false;
      }
    }),
    {
      name: 'signal-shell-lesson',
      partialize: (state) => ({ currentLessonIdx: state.currentLessonIdx, currentTaskIdx: state.currentTaskIdx }),
    }
  )
);
