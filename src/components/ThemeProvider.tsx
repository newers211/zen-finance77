'use client';

import { useLayoutEffect } from 'react';
import { useFinanceStore } from '@/store/useStore';

/**
 * Applies theme from store to <html class="dark"> so Tailwind dark: works on all pages.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}
