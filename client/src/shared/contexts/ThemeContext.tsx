'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'dark' | 'white' | 'blue' | 'pink';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    const savedTheme = localStorage.getItem('proq-theme') as ThemeType;
    if (savedTheme && ['dark', 'white', 'blue', 'pink'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 테마 변경 시 localStorage 저장, data-theme 속성 및 class 모두 설정
    localStorage.setItem('proq-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('dark', 'white', 'blue', 'pink');
    document.documentElement.classList.add(theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
