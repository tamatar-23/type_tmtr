import { useState, useCallback, useEffect, useRef } from 'react';
import { TestSettings, TypingStats, Word, TestResult } from '@/types/typing';
import { generateText } from '@/utils/words';
import { firestoreService } from '@/services/firestore';
import { useAuth } from '@/hooks/useAuth';

export function useTypingTest(settings: TestSettings) {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.mode === 'time' ? settings.duration : 0);
  
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0, rawWpm: 0, accuracy: 0, correct: 0, incorrect: 0, missed: 0, extra: 0, totalTime: 0, charCount: 0
  });
  
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number; rawWpm: number }[]>([]);
  const [errorHistory, setErrorHistory] = useState<{ time: number; index: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const startTime = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const wpmIntervalRef = useRef<NodeJS.Timeout>();
  const hasSaved = useRef<boolean>(false);

  const initializeTest = useCallback(() => {
    const wordCount = settings.mode === 'words' ? settings.duration : 200; // Generate enough for time mode
    const text = generateText(wordCount, settings.difficulty);
    
    const initialWords = text.split(' ').map(w => ({
      text: w,
      chars: w.split('').map(c => ({ value: c, status: 'pending' as const }))
    }));
    
    setWords(initialWords);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(settings.mode === 'time' ? settings.duration : 0);
    setStats({
      wpm: 0, rawWpm: 0, accuracy: 0, correct: 0, incorrect: 0, missed: 0, extra: 0, totalTime: 0, charCount: 0
    });
    setWpmHistory([]);
    setErrorHistory([]);
    hasSaved.current = false;
  }, [settings]);

  const calculateStats = useCallback((currentWords: Word[], elapsedTime: number) => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    
    currentWords.forEach((word, wIdx) => {
      word.chars.forEach(char => {
        if (char.status === 'correct') correct++;
        if (char.status === 'incorrect') incorrect++;
        if (char.status === 'extra') extra++;
      });
      // implicitly typed spaces count as correct
      if (wIdx < currentWordIndex) correct++;
    });

    const totalTyped = correct + incorrect + extra;
    const accuracy = totalTyped > 0 ? (correct / totalTyped) * 100 : 0;
    const minutes = elapsedTime / 60;
    
    const rawWpm = minutes > 0 ? Math.round((totalTyped / 5) / minutes) : 0;
    const netWpm = minutes > 0 ? Math.round(((correct - (incorrect + extra)) / 5) / minutes) : 0;
    
    return { 
      wpm: accuracy === 100 ? rawWpm : Math.max(0, netWpm), 
      rawWpm,
      accuracy: Math.round(accuracy), 
      correct, 
      incorrect, 
      missed: 0, 
      extra, 
      totalTime: elapsedTime, 
      charCount: totalTyped 
    };
  }, [currentWordIndex]);

  const saveTestResult = useCallback(async (finalStats: TypingStats, finalWpmHistory: { time: number; wpm: number; rawWpm: number }[], finalErrorHistory: { time: number; index: number }[]) => {
    if (!user || hasSaved.current) return;
    setIsSaving(true);
    hasSaved.current = true;
    try {
      const result: TestResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        settings: { ...settings },
        wpmHistory: [...finalWpmHistory],
        errorHistory: [...finalErrorHistory],
        ...finalStats
      };
      await firestoreService.saveTestResult(user.uid, result);
    } catch (error) {
      console.error(error);
      hasSaved.current = false;
    } finally {
      setIsSaving(false);
    }
  }, [user, settings]);

  const finishTest = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);

    setStats(prev => {
      // Calculate final
      if (user && !hasSaved.current) saveTestResult(prev, wpmHistory, errorHistory);
      return prev;
    });
  }, [isFinished, user, wpmHistory, errorHistory, saveTestResult]);

  const startTest = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTime.current = Date.now();
      hasSaved.current = false;

      if (settings.mode === 'time') {
        intervalRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              finishTest();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      wpmIntervalRef.current = setInterval(() => {
        setWords(currentWords => {
          const elapsed = (Date.now() - startTime.current) / 1000;
          setStats(calculateStats(currentWords, elapsed));
          setWpmHistory(prev => {
            const s = calculateStats(currentWords, elapsed);
            return [...prev, { time: elapsed, wpm: s.wpm, rawWpm: s.rawWpm }];
          });
          return currentWords;
        });
      }, 1000);
    }
  }, [isActive, settings.mode, calculateStats, finishTest]);

  const handleKeyDown = useCallback((key: string, ctrlKey: boolean) => {
    if (isFinished) return;
    if (!isActive && key.length === 1) startTest();

    setWords(prevWords => {
      const newWords = [...prevWords];
      let wIdx = currentWordIndex;
      let cIdx = currentCharIndex;

      const currentWord = newWords[wIdx];
      const hasErrorInCurrentWord = currentWord.chars.some(c => c.status === 'incorrect' || c.status === 'extra') || currentWord.isError;

      if (settings.stopOnError && hasErrorInCurrentWord && key !== 'Backspace') {
        return prevWords; // Block advancing
      }

      if (key === 'Backspace') {
        if (ctrlKey) {
          const cw = { ...newWords[wIdx], chars: [...newWords[wIdx].chars] };
          cw.chars.splice(cw.text.length); // remove extras
          for (let i = 0; i < cw.chars.length; i++) {
            cw.chars[i].status = 'pending';
            cw.chars[i].actualValue = undefined;
          }
          cw.isError = false;
          newWords[wIdx] = cw;
          cIdx = 0;
        } else {
          if (cIdx > 0) {
            const cw = { ...newWords[wIdx], chars: [...newWords[wIdx].chars] };
            cIdx--;
            if (cIdx >= cw.text.length) {
              cw.chars.pop(); // remove extra
            } else {
              cw.chars[cIdx].status = 'pending';
              cw.chars[cIdx].actualValue = undefined;
            }
            cw.isError = false; // re-evaluate
            newWords[wIdx] = cw;
          } else if (wIdx > 0) {
            wIdx--;
            const prevWord = newWords[wIdx];
            cIdx = prevWord.chars.length;
          }
        }
      } else if (key === ' ') {
        if (wIdx < newWords.length - 1) {
          const cw = { ...newWords[wIdx], chars: [...newWords[wIdx].chars] };
          let hasErrors = false;
          for (let i = cIdx; i < cw.text.length; i++) {
            cw.chars[i].status = 'missed';
            hasErrors = true;
          }
          if (cw.chars.some(c => c.status === 'incorrect' || c.status === 'extra' || c.status === 'missed')) {
            hasErrors = true;
          }
          cw.isError = hasErrors;
          newWords[wIdx] = cw;

          wIdx++;
          cIdx = 0;
        }
      } else if (key.length === 1) {
        const cw = { ...newWords[wIdx], chars: [...newWords[wIdx].chars] };
        let isErrorNow = false;

        if (cIdx >= cw.text.length) {
          if (cIdx < cw.text.length + 10) {
            cw.chars.push({ value: key, status: 'extra', actualValue: key });
            cIdx++;
            isErrorNow = true;
          }
        } else {
          const expectedChar = cw.chars[cIdx].value;
          if (key === expectedChar) {
            cw.chars[cIdx].status = 'correct';
            cw.chars[cIdx].actualValue = undefined;
          } else {
            cw.chars[cIdx].status = 'incorrect';
            cw.chars[cIdx].actualValue = key;
            isErrorNow = true;
          }
          cIdx++;
        }
        newWords[wIdx] = cw;

        if (isErrorNow) {
          const elapsed = (Date.now() - startTime.current) / 1000;
          let globalIndex = 0;
          for (let i = 0; i < wIdx; i++) globalIndex += newWords[i].text.length + 1;
          globalIndex += cIdx - 1;
          setErrorHistory(prev => [...prev, { time: elapsed, index: globalIndex }]);
        }

        if (settings.mode === 'words' && wIdx === newWords.length - 1 && cIdx === cw.chars.length) {
          setTimeout(finishTest, 0);
        }
      }

      setCurrentWordIndex(wIdx);
      setCurrentCharIndex(cIdx);
      
      if (isActive) {
        const elapsed = (Date.now() - startTime.current) / 1000;
        setStats(calculateStats(newWords, elapsed));
      }

      return newWords;
    });
  }, [isFinished, isActive, startTest, currentWordIndex, currentCharIndex, settings.mode, settings.stopOnError, finishTest, calculateStats]);

  const resetTest = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    initializeTest();
  }, [initializeTest]);

  const getResult = useCallback((): TestResult => {
    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      settings,
      wpmHistory,
      errorHistory,
      ...stats
    };
  }, [settings, stats, wpmHistory, errorHistory]);

  useEffect(() => {
    initializeTest();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    };
  }, [initializeTest]);

  return {
    words,
    currentWordIndex,
    currentCharIndex,
    isActive,
    isFinished,
    timeLeft,
    stats,
    wpmHistory,
    isSaving,
    handleKeyDown,
    resetTest,
    getResult
  };
}
