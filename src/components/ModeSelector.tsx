
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
    <div 
      className="flex items-center gap-4 rounded-lg p-2 border"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'var(--theme-stats)',
        borderWidth: '1px'
      }}
    >
      {/* Mode Toggle */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSettingsChange({ ...settings, mode: 'time', duration: 30 })}
          disabled={disabled}
          className="px-4 h-8 hover:bg-transparent font-semibold"
          style={{
            backgroundColor: settings.mode === 'time' ? 'var(--theme-key-pressed)' : 'transparent',
            color: settings.mode === 'time' ? 'var(--theme-title)' : 'var(--theme-typebox)',
            borderColor: settings.mode === 'time' ? 'var(--theme-title)' : 'transparent'
          }}
        >
          Time
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSettingsChange({ ...settings, mode: 'words', duration: 50 })}
          disabled={disabled}
          className="px-4 h-8 hover:bg-transparent font-semibold"
          style={{
            backgroundColor: settings.mode === 'words' ? 'var(--theme-key-pressed)' : 'transparent',
            color: settings.mode === 'words' ? 'var(--theme-title)' : 'var(--theme-typebox)',
            borderColor: settings.mode === 'words' ? 'var(--theme-title)' : 'transparent'
          }}
        >
          Words
        </Button>
      </div>

      {/* Separator */}
      <Separator 
        orientation="vertical" 
        className="h-8" 
        style={{ backgroundColor: 'var(--theme-stats)', opacity: 0.3 }}
      />

      {/* Duration Options */}
      <div className="flex items-center gap-1">
        {settings.mode === 'time' ? (
          timeOptions.map((time) => (
            <Button
              key={time}
              variant="ghost"
              size="sm"
              onClick={() => onSettingsChange({ ...settings, duration: time })}
              disabled={disabled}
              className="px-4 h-8 hover:bg-transparent"
              style={{
                backgroundColor: settings.duration === time ? 'var(--theme-key-pressed)' : 'transparent',
                color: settings.duration === time ? 'var(--theme-title)' : 'var(--theme-typebox)',
                borderColor: settings.duration === time ? 'var(--theme-title)' : 'transparent'
              }}
            >
              {time}
            </Button>
          ))
        ) : (
          wordOptions.map((words) => (
            <Button
              key={words}
              variant="ghost"
              size="sm"
              onClick={() => onSettingsChange({ ...settings, duration: words })}
              disabled={disabled}
              className="px-4 h-8 hover:bg-transparent"
              style={{
                backgroundColor: settings.duration === words ? 'var(--theme-key-pressed)' : 'transparent',
                color: settings.duration === words ? 'var(--theme-title)' : 'var(--theme-typebox)',
                borderColor: settings.duration === words ? 'var(--theme-title)' : 'transparent'
              }}
            >
              {words}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
