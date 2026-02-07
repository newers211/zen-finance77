'use client';

import { useLayoutEffect, useEffect, useState } from 'react';
import { useFinanceStore } from '@/store/useStore';

/**
 * Applies theme from store to <html class="dark"> so Tailwind dark: works on all pages.
 * Also syncs with system preference changes when no user preference is set.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);
  const setTheme = useFinanceStore((s) => s.setTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Применяем тему из store при изменении
  useLayoutEffect(() => {
    if (!isInitialized) return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme, isInitialized]);

  // Слушаем изменения системной темы и синхронизируем при первом входе
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Если пользователь уже выбрал тему вручную, не перезаписываем
      const raw = localStorage.getItem('zen-finance-storage');
      if (raw) {
        try {
          const data = JSON.parse(raw);
          // Если тема была явно установлена (не system), игнорируем
          if (data.state && (data.state.theme === 'dark' || data.state.theme === 'light')) {
            return;
          }
        } catch (e) {}
      }
      // Применяем системную тему
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    // Проверяем системную тему только при первой загрузке
    const checkSystemTheme = () => {
      const raw = localStorage.getItem('zen-finance-storage');
      let userTheme: 'light' | 'dark' | null = null;

      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (data.state && (data.state.theme === 'dark' || data.state.theme === 'light')) {
            userTheme = data.state.theme;
          }
        } catch (e) {}
      }

      // Если пользователь ещё не выбирал тему, используем системную
      if (!userTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }

      setIsInitialized(true);
    };

    checkSystemTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  return <>{children}</>;
}
