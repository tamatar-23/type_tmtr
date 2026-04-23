import { useEffect, useRef } from 'react';
import { Word } from '@/types/typing';

interface TypingAreaProps {
  words: Word[];
  currentWordIndex: number;
  currentCharIndex: number;
  onKeyDown: (key: string, ctrlKey: boolean) => void;
  isFinished: boolean;
}

export function TypingArea({ words, currentWordIndex, currentCharIndex, onKeyDown, isFinished }: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  // Global key listener
  useEffect(() => {
    if (isFinished) return;

    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        window.location.reload();
        return;
      }

      if (e.ctrlKey && e.key === 'r') {
         return; // Let browser reload
      }

      // Ignore modifiers
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;

      // Only handle printable characters or backspace/space
      if (e.key.length === 1 || e.key === 'Backspace') {
        e.preventDefault();
        onKeyDown(e.key, e.ctrlKey);
      }
    };

    window.addEventListener('keydown', handleKeyDownEvent);
    return () => window.removeEventListener('keydown', handleKeyDownEvent);
  }, [isFinished, onKeyDown]);

  // Caret positioning
  useEffect(() => {
    if (caretRef.current && activeCharRef.current && containerRef.current) {
      const charRect = activeCharRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Relative to container
      const x = charRect.left - containerRect.left;
      const y = charRect.top - containerRect.top;

      caretRef.current.style.transform = `translate(${x}px, ${y}px)`;
      caretRef.current.style.height = `${charRect.height}px`;
      
      // Auto scroll
      const offsetTop = activeCharRef.current.offsetTop;
      const containerHeight = containerRef.current.clientHeight;
      if (offsetTop > containerHeight / 2) {
         containerRef.current.scrollTop = offsetTop - containerHeight / 2;
      } else {
         containerRef.current.scrollTop = 0;
      }
    }
  }, [currentWordIndex, currentCharIndex, words]);

  const getCharClass = (status: string) => {
    switch (status) {
      case 'pending': return 'text-text-muted';
      case 'correct': return 'text-text-primary';
      case 'incorrect': return 'text-destructive opacity-100';
      case 'extra': return 'text-destructive opacity-100';
      case 'missed': return 'text-destructive opacity-50';
      default: return 'text-text-muted';
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden text-left font-sans select-none focus:outline-none"
      style={{ fontSize: 'var(--typing-font-size)', lineHeight: '1.5', height: '5.8em' }}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden transition-all duration-200"
      >
        {/* The custom caret */}
        {!isFinished && (
          <div 
            ref={caretRef}
            className="absolute left-0 top-0 w-[2px] bg-text-primary transition-transform duration-100 ease-out animate-caret-blink z-10"
          />
        )}
        
        <div className="flex flex-wrap gap-x-[0.5em] gap-y-[0.5em]">
          {words.map((word, wIdx) => (
            <div 
              key={wIdx} 
              className={`flex pb-[2px] border-b-2 ${
                word.isError 
                  ? 'border-destructive' 
                  : wIdx === currentWordIndex 
                    ? 'border-text-muted/30' 
                    : 'border-transparent'
              }`}
            >
              {word.chars.map((char, cIdx) => {
                const isActive = wIdx === currentWordIndex && cIdx === currentCharIndex;
                return (
                  <span
                    key={cIdx}
                    ref={isActive ? activeCharRef : null}
                    className={`${getCharClass(char.status)} transition-colors duration-100 whitespace-pre`}
                  >
                    {char.actualValue || char.value}
                  </span>
                );
              })}
              {/* Invisible span at the end of the word to position the caret for the space */}
              <span 
                ref={wIdx === currentWordIndex && currentCharIndex === word.chars.length ? activeCharRef : null}
                className="inline-block w-[0.1px] opacity-0 whitespace-pre"
              >
                &nbsp;
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
