import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TestSettings } from '@/types/typing';

interface ModeSelectorProps {
  settings: TestSettings;
  onSettingsChange: (settings: TestSettings) => void;
  disabled?: boolean;
}

export function ModeSelector({ settings, onSettingsChange, disabled }: ModeSelectorProps) {
  const timeOptions = [15, 30, 60, 120];
  const wordOptions = [10, 25, 50, 100];

  return (
    <div className="flex items-center gap-3 rounded-2xl p-1.5 bg-secondary-bg border border-border/50 shadow-sm backdrop-blur-sm transition-opacity">
      {/* Mode Toggle */}
      <div className="flex items-center bg-background rounded-xl p-1 shadow-inner border border-border/30">
        <Button
          variant={settings.mode === 'time' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSettingsChange({ ...settings, mode: 'time', duration: 30 })}
          disabled={disabled}
          className="h-7 px-4 rounded-lg text-xs"
        >
          Time
        </Button>
        <Button
          variant={settings.mode === 'words' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSettingsChange({ ...settings, mode: 'words', duration: 50 })}
          disabled={disabled}
          className="h-7 px-4 rounded-lg text-xs"
        >
          Words
        </Button>
      </div>

      {/* Separator */}
      <Separator orientation="vertical" className="h-5 bg-border/50" />

      {/* Duration Options */}
      <div className="flex items-center bg-background rounded-xl p-1 shadow-inner border border-border/30 gap-0.5">
        {settings.mode === 'time' ? (
          timeOptions.map((time) => (
            <Button
              key={time}
              variant={settings.duration === time ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onSettingsChange({ ...settings, duration: time })}
              disabled={disabled}
              className="h-7 w-10 p-0 rounded-lg text-xs"
            >
              {time}
            </Button>
          ))
        ) : (
          wordOptions.map((words) => (
            <Button
              key={words}
              variant={settings.duration === words ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onSettingsChange({ ...settings, duration: words })}
              disabled={disabled}
              className="h-7 w-10 p-0 rounded-lg text-xs"
            >
              {words}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
