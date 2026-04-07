'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeConfig } from '@/types';

interface ThemeContextType {
  theme: ThemeConfig;
  isLoaded: boolean;
  resolvedMode: 'light' | 'dark';
  setTheme: (config: Partial<ThemeConfig>) => void;
  setFullTheme: (config: ThemeConfig) => void;
  toggleMode: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useTheme();

  const value = useMemo(() => themeState, [themeState]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}