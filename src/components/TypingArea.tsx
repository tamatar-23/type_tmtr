
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character } from '@/types/typing';

interface TypingAreaProps {
  text: string;
  characters: Character[];
  currentIndex: number;
  userInput: string;
  onInput: (value: string) => void;
  onSpaceSkip: (currentIndex: number) => void;
  isFinished: boolean;
}

export function TypingArea({ 
  text, 
  characters, 
  currentIndex, 
  userInput, 
  onInput, 
  onSpaceSkip,
  isFinished 
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [isFinished]);

  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    if (!isFocused) {
      handleFocus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        window.location.reload();
      }
      
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        window.location.reload();
      }
      
      if (e.key === ' ') {
        e.preventDefault();
        
        const currentChar = text[currentIndex];
        if (currentChar === ' ') {
          const newInput = userInput + ' ';
          onInput(newInput);
        } else {
          onSpaceSkip(currentIndex);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, text, userInput, onInput, onSpaceSkip]);

  const getCharStyle = (char: Character, index: number) => {
    let baseStyle = "relative text-2xl font-atkinson font-medium";
    
    switch (char.status) {
      case 'correct':
        return `${baseStyle}` ;
      case 'incorrect':
        return `${baseStyle} text-red-500 bg-red-500/20`;
      case 'missed':
        return `${baseStyle} opacity-50`;
      default:
        return `${baseStyle} opacity-50`;
    }
  };

  // Split text into words and create lines that fit properly - increased to 11 words per line
  const words = text.split(' ');
  const lines: string[][] = [];
  const maxWordsPerLine = 11; // Increased from 10 to 11
  
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine));
  }

  // Find which line contains the current position
  let charCount = 0;
  let targetLineIndex = 0;
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineText = lines[lineIndex].join(' ') + (lineIndex < lines.length - 1 ? ' ' : '');
    if (charCount + lineText.length > currentIndex) {
      targetLineIndex = lineIndex;
      break;
    }
    charCount += lineText.length;
  }

  // Move to next line when cursor reaches the third line
  useEffect(() => {
    if (targetLineIndex >= currentLineIndex + 2 && targetLineIndex > 0) {
      setCurrentLineIndex(targetLineIndex - 1);
    }
  }, [targetLineIndex, currentLineIndex]);

  // Show 3 lines at a time
  const visibleLines = lines.slice(currentLineIndex, currentLineIndex + 3);
  
  // Calculate visible text and character indices
  let visibleStartIndex = 0;
  for (let i = 0; i < currentLineIndex; i++) {
    const lineText = lines[i].join(' ') + (i < lines.length - 1 ? ' ' : '');
    visibleStartIndex += lineText.length;
  }

  const visibleText = visibleLines.map(line => line.join(' ')).join(' ');
  const visibleCharacters = characters.slice(visibleStartIndex, visibleStartIndex + visibleText.length);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8">
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onInput(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="absolute inset-0 opacity-0 cursor-default"
        disabled={isFinished}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
      
      <div 
        className="relative font-atkinson font-medium text-2xl leading-relaxed p-8 min-h-[200px] cursor-text focus-within:outline-none"
        onClick={handleContainerClick}
        style={{ color: 'var(--theme-typebox)' }}
      >
        {!isFocused && !isFinished && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 rounded-lg cursor-pointer"
            style={{ 
              backgroundColor: 'var(--theme-background)',
              opacity: 0.7
            }}
            onClick={handleContainerClick}
          >
            <div 
              className="text-lg font-medium px-4 py-2 rounded-lg"
              style={{ 
                color: 'var(--theme-typebox)',
                backgroundColor: 'var(--theme-background)',
                opacity: 0.9
              }}
            >
              Click to focus
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentLineIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
            style={{ height: '180px' }}
          >
            {visibleLines.map((line, lineIdx) => (
              <div key={currentLineIndex + lineIdx} className="flex flex-wrap mb-4 leading-tight">
                {line.map((word, wordIdx) => {
                  let wordStartIndex = visibleStartIndex;
                  for (let i = 0; i < lineIdx; i++) {
                    wordStartIndex += visibleLines[i].join(' ').length + 1;
                  }
                  for (let i = 0; i < wordIdx; i++) {
                    wordStartIndex += line[i].length + 1;
                  }
                  
                  return (
                    <span key={`${lineIdx}-${wordIdx}`} className="mr-2">
                      {word.split('').map((char, charIdx) => {
                        const globalIndex = wordStartIndex + charIdx;
                        const character = visibleCharacters[globalIndex - visibleStartIndex];
                        if (!character) return null;
                        
                        return (
                          <span
                            key={globalIndex}
                            className={`${getCharStyle(character, globalIndex)} ${
                              globalIndex === currentIndex ? 'relative' : ''
                            }`}
                          >
                            {char}
                            {globalIndex === currentIndex && isFocused && (
                              <span 
                                className="absolute w-0.5 h-6 animate-pulse"
                                style={{ 
                                  backgroundColor: 'var(--theme-cursor)',
                                  top: '2px',
                                  left: '0'
                                }}
                              ></span>
                            )}
                          </span>
                        );
                      })}
                      {(wordIdx < line.length - 1 || lineIdx < visibleLines.length - 1) ? (
                        <span
                          className={`${getCharStyle(
                            visibleCharacters[wordStartIndex + word.length - visibleStartIndex] || { char: ' ', status: 'pending' },
                            wordStartIndex + word.length
                          )} ${
                            wordStartIndex + word.length === currentIndex ? 'relative' : ''
                          }`}
                        >
                          {'\u00A0'}
                          {wordStartIndex + word.length === currentIndex && isFocused && (
                            <span 
                              className="absolute w-0.5 h-6 animate-pulse"
                              style={{ 
                                backgroundColor: 'var(--theme-cursor)',
                                top: '2px',
                                left: '0'
                              }}
                            ></span>
                          )}
                        </span>
                      ) : null}
                    </span>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
