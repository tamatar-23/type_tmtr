
export type TestMode = 'time' | 'words';

export interface TestSettings {
  mode: TestMode;
  duration: number; // seconds for time mode, word count for words mode
  difficulty: 'easy' | 'hard';
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  missed: number;
  totalTime: number;
  charCount: number;
}

export interface TestResult extends TypingStats {
  id: string;
  timestamp: Date;
  settings: TestSettings;
  wpmHistory: { time: number; wpm: number }[];
}

export interface Character {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'missed';
}
