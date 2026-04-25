import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof Colors.light;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;

  const toggle = () => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return isDark ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
