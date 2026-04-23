import * as React from "react";
import { X, Moon, Sun, Monitor, Type, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext, Theme, FontSize } from "@/contexts/ThemeContext";
import { TestSettings } from "@/types/typing";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TestSettings;
  onSettingsChange: (settings: TestSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) {
  const { theme, setTheme, fontSize, setFontSize } = useThemeContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-md rounded-[12px] border border-border bg-background p-6 shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <Sun className="h-4 w-4" /> Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {(['light', 'dark', 'system', 'catppuccin-latte', 'catppuccin-mocha', 'dracula', 'nord', 'gruvbox', 'matcha', 'peach'] as Theme[]).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'primary' : 'secondary'}
                  className="capitalize text-xs px-3"
                  onClick={() => setTheme(t)}
                >
                  {t.replace('catppuccin-', '')}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <Type className="h-4 w-4" /> Font Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['small', 'medium', 'large', 'xlarge'] as FontSize[]).map((s) => (
                <Button
                  key={s}
                  variant={fontSize === s ? 'primary' : 'secondary'}
                  className="w-full text-xs capitalize"
                  onClick={() => setFontSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Behavior
            </label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={settings.stopOnError ? 'primary' : 'secondary'}
                className="w-full justify-between px-4"
                onClick={() => onSettingsChange({ ...settings, stopOnError: !settings.stopOnError })}
              >
                <span>Stop on Error</span>
                <span className="text-xs opacity-75">{settings.stopOnError ? 'Enabled' : 'Disabled'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
