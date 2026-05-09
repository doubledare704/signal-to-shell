import { useEffect, useRef } from 'react';
import { useVFSStore } from '../store/vfsStore';
import { useLessonStore, LESSONS } from '../store/lessonStore';
import { playDigitalUnlockSound } from './audio';

export const useJudgeEngine = () => {
  const vfs = useVFSStore((state) => state.vfs);
  const history = useVFSStore((state) => state.history);
  const currentPath = useVFSStore((state) => state.currentPath);
  
  const { validateCurrentTask, isSuccess, currentLessonIdx, currentTaskIdx } = useLessonStore();
  const currentLesson = LESSONS[currentLessonIdx];

  const prevTaskIdx = useRef(currentTaskIdx);

  // Play sound when a sub-task is completed
  useEffect(() => {
    if (currentTaskIdx > prevTaskIdx.current) {
      playDigitalUnlockSound();
    }
    prevTaskIdx.current = currentTaskIdx;
  }, [currentTaskIdx]);

  useEffect(() => {
    if (!isSuccess && currentLesson) {
      const lessonPassed = validateCurrentTask(vfs, history, currentPath);
      if (lessonPassed) {
        playDigitalUnlockSound();
      }
    }
  }, [vfs, history, currentPath, isSuccess, validateCurrentTask, currentLesson]);
};
