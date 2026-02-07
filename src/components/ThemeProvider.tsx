'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/store/useStore';

/**
 * Applies theme from store to <html class="dark"> so Tailwind dark: works on all pages.
 * Only handles initial setup - direct theme changes are applied in SettingsModal.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);

  // Применяем тему при изменении
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDark = theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      console.log('ThemeProvider: Applied theme', theme, 'dark class:', isDark);
    }
  }, [theme]);

  return <>{children}</>;
}
