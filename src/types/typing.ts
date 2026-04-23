export type TestMode = 'time' | 'words';

export interface TestSettings {
  mode: TestMode;
  duration: number; // seconds for time mode, word count for words mode
  difficulty: 'easy' | 'hard';
  stopOnError: boolean;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  missed: number;
  extra: number;
  totalTime: number;
  charCount: number;
}

export interface TestResult extends TypingStats {
  id: string;
  timestamp: Date;
  settings: TestSettings;
  wpmHistory: { time: number; wpm: number; rawWpm: number }[];
  errorHistory: { time: number; index: number }[];
}

export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'extra' | 'missed';

export interface Character {
  value: string;
  status: CharStatus;
  actualValue?: string;
}

export interface Word {
  text: string;
  chars: Character[];
  isError?: boolean;
}
