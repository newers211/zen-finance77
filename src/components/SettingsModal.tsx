'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun } from 'lucide-react';
import { useFinanceStore } from '@/store/useStore';

// Применяем тему к документу
function applyTheme(theme: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    console.log('applyTheme: Applied', theme, 'dark class:', isDark);
  }
}

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { theme, setTheme, lang, setLang } = useFinanceStore();

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    console.log('Switching theme from', theme, 'to', newTheme);
    // Сначала применяем тему напрямую (мгновенно)
    applyTheme(newTheme);
    // Потом обновляем store (сохранение)
    setTheme(newTheme);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-8"><h2 className="text-xl font-black">Settings</h2><button onClick={onClose}><X/></button></div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400 mb-2">Theme</p>
                <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleSetTheme('light')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                      theme === 'light'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600'
                        : 'text-zinc-500 dark:text-zinc-400 opacity-70 hover:opacity-90'
                    }`}
                  >
                    <Sun size={16} /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-zinc-700 text-white shadow-sm ring-1 ring-zinc-600'
                        : 'text-zinc-500 dark:text-zinc-400 opacity-70 hover:opacity-90'
                    }`}
                  >
                    <Moon size={16} /> Dark
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400 mb-2">Language</p>
                <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button onClick={() => setLang('ru')} className={`py-2 rounded-lg ${lang === 'ru' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'opacity-40'}`}>RU</button>
                  <button onClick={() => setLang('en')} className={`py-2 rounded-lg ${lang === 'en' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'opacity-40'}`}>EN</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}