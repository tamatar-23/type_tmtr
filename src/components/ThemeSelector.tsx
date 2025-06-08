
import { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useThemeContext } from '@/contexts/ThemeContext';
import { themeOptions, themes } from '@/config/themes';

export function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeContext();
  const [open, setOpen] = useState(false);

  const currentThemeLabel = themes[currentTheme]?.label || 'Theme';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-white/10 border border-white/20"
          style={{ color: 'var(--theme-stats)' }}
        >
          <Palette className="h-4 w-4" />
          <span className="text-sm font-medium">{currentThemeLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-md border-0"
        style={{ 
          backgroundColor: 'var(--theme-background)',
          color: 'var(--theme-typebox)'
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--theme-title)' }}>Select Theme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {themeOptions.map((option) => {
            const theme = themes[option.value];
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${currentTheme === option.value 
                    ? 'shadow-lg' 
                    : 'hover:opacity-80'
                  }
                `}
                style={{
                  backgroundColor: `${theme.background}`,
                  borderColor: currentTheme === option.value ? theme.title : theme.typeBoxText,
                  borderWidth: currentTheme === option.value ? '2px' : '1px'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: theme.background,
                      borderColor: theme.typeBoxText
                    }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: theme.title,
                      borderColor: theme.typeBoxText
                    }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: theme.typeBoxText,
                      borderColor: theme.typeBoxText
                    }}
                  />
                </div>
                <div 
                  className="text-sm font-medium"
                  style={{ color: theme.title }}
                >
                  {option.label}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
