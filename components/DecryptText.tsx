import React, { useState, useEffect, useRef } from 'react';
import { useLessonStore } from '../store/lessonStore';

interface DecryptTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const DecryptText: React.FC<DecryptTextProps> = ({ text, speed = 40, onComplete, className }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '0123456789ABCDEF!@#$%^&*()_+';
  const setIsDecrypting = useLessonStore((state) => state.setIsDecrypting);
  
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const words = text.split(' ');
    let iteration = 0;
    setIsDecrypting(true);

    const interval = setInterval(() => {
      setDisplayText(
        words
          .map((word, index) => {
            if (index < Math.floor(iteration)) return word;
            if (index === Math.floor(iteration)) {
              return word.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
            }
            return '';
          })
          .filter(Boolean)
          .join(' ')
      );

      if (iteration >= words.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsDecrypting(false);
        if (onCompleteRef.current) onCompleteRef.current();
      }
      
      iteration += 0.5; // Reveal words, 2 ticks per word
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, setIsDecrypting]);

  const defaultStyles = "font-mono text-[#00FF9F] drop-shadow-[0_0_5px_#00FF9F]";
  
  return <span className={className || defaultStyles}>{displayText}</span>;
};

export default DecryptText;
