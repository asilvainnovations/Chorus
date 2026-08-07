// src/hooks/useTheme.ts
import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const { settings, updateSettings } = useChatStore();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const resolveTheme = useCallback((theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') return getSystemTheme();
    return theme;
  }, []);

  useEffect(() => {
    const theme = resolveTheme(settings.theme as Theme);
    setResolvedTheme(theme);

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [settings.theme, resolveTheme]);

  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  const toggleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme as Theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    updateSettings({ theme: nextTheme });
  }, [settings.theme, updateSettings]);

  const setTheme = useCallback((theme: Theme) => {
    updateSettings({ theme });
  }, [updateSettings]);

  return {
    theme: settings.theme as Theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
  };
};
