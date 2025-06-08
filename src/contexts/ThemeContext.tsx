
import { createContext, useContext, useEffect, useState } from 'react';
import { themes, Theme } from '@/config/themes';

interface ThemeContextType {
  currentTheme: string;
  themeConfig: Theme;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('typeflow-theme');
    return saved && themes[saved] ? saved : 'vantaBlack';
  });

  const themeConfig = themes[currentTheme] || themes.vantaBlack;

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('typeflow-theme', themeName);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply custom theme variables
    root.style.setProperty('--theme-background', themeConfig.background);
    root.style.setProperty('--theme-title', themeConfig.title);
    root.style.setProperty('--theme-typebox', themeConfig.typeBoxText);
    root.style.setProperty('--theme-stats', themeConfig.stats);
    root.style.setProperty('--theme-keyboard-bg', themeConfig.keyboardBackground);
    root.style.setProperty('--theme-key-bg', themeConfig.keyBackground);
    root.style.setProperty('--theme-key-text', themeConfig.keyText);
    root.style.setProperty('--theme-key-pressed', themeConfig.keyPressed);
    root.style.setProperty('--theme-cursor', themeConfig.cursor);
    
    // Apply shadcn theme class for UI components
    root.classList.remove('light', 'dark');
    root.classList.add(themeConfig.isDark ? 'dark' : 'light');
    
    // Update body background
    document.body.style.backgroundColor = themeConfig.background;
    document.body.style.color = themeConfig.typeBoxText;
  }, [themeConfig]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeConfig, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
}
