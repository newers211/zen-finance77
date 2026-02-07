'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/store/useStore';

/**
 * Applies theme from store to <html class="dark"> so Tailwind dark: works on all pages (main, login, etc.)
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
