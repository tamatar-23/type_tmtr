import { TypingStats } from '@/types/typing';

interface StatsDisplayProps {
  stats: TypingStats;
  timeLeft?: number;
  mode: 'time' | 'words';
}

export function StatsDisplay({ stats, timeLeft, mode }: StatsDisplayProps) {
  return (
    <div className="w-full max-w-xl mx-auto grid grid-cols-3 gap-8 text-sm text-text-secondary font-medium tracking-wide">
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold text-text-primary tracking-tighter mb-1">{stats.wpm}</div>
        <div className="uppercase text-[10px] font-bold tracking-[0.2em] text-text-muted">WPM</div>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold text-text-primary tracking-tighter mb-1">{stats.accuracy}%</div>
        <div className="uppercase text-[10px] font-bold tracking-[0.2em] text-text-muted">Accuracy</div>
      </div>
      
      {mode === 'time' && timeLeft !== undefined && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-extrabold text-text-primary tracking-tighter mb-1">{timeLeft}</div>
          <div className="uppercase text-[10px] font-bold tracking-[0.2em] text-text-muted">Time</div>
        </div>
      )}
      
      {mode === 'words' && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-extrabold text-text-primary tracking-tighter mb-1">
            {Math.round(stats.totalTime)}s
          </div>
          <div className="uppercase text-[10px] font-bold tracking-[0.2em] text-text-muted">Time</div>
        </div>
      )}
    </div>
  );
}
