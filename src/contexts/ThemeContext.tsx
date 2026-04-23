import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = "light" | "dark" | "system" | "catppuccin-latte" | "catppuccin-frappe" | "catppuccin-macchiato" | "catppuccin-mocha";
export type FontSize = "small" | "medium" | "large" | "xlarge";

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const FONT_SIZES: Record<FontSize, string> = {
  small: '16px',
  medium: '20px',
  large: '24px',
  xlarge: '28px',
};

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('typeflow-theme') as Theme) || 'system';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('typeflow-font-size') as FontSize) || 'medium';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('typeflow-theme', newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('typeflow-font-size', newSize);
  };

  useEffect(() => {
    const root = document.documentElement;

    // Apply Theme
    root.classList.remove('light', 'dark', 'catppuccin-latte', 'catppuccin-frappe', 'catppuccin-macchiato', 'catppuccin-mocha');
    root.removeAttribute('data-theme');
    
    let activeTheme = theme;
    if (theme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.classList.add(activeTheme);
    root.setAttribute('data-theme', activeTheme);
    
    // Apply Font Size
    root.style.setProperty('--typing-font-size', FONT_SIZES[fontSize]);
    
  }, [theme, fontSize]);

  return (
    <ThemeContext.Provider value={{ theme, fontSize, setTheme, setFontSize }}>
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
