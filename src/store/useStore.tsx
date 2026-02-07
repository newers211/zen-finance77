import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Описание структуры хранилища
interface FinanceStore {
  // Данные
  transactions: any[];
  categories: any[];
  
  // Настройки интерфейса
  theme: 'light' | 'dark';
  lang: 'ru' | 'en';
  
  // Логика валюты
  currency: 'RUB' | 'USD';
  rate: number;

  // Методы для обновления данных
  setTransactions: (t: any[]) => void;
  addTransaction: (t: any) => void;
  removeTransaction: (id: string) => void;
  setCategories: (c: any[]) => void;
  
  // Методы для настроек
  setTheme: (t: 'light' | 'dark') => void;
  setLang: (l: 'ru' | 'en') => void;
  setCurrency: (c: 'RUB' | 'USD') => void;
  setRate: (r: number) => void;

  // Очистить данные пользователя при выходе (чтобы другой пользователь не видел чужие данные)
  clearUserData: () => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      // Начальные состояния
      transactions: [],
      categories: [],
      theme: 'light', // Всегда 'light' при первом рендере для избежания hydration mismatch
      lang: 'ru',
      currency: 'RUB',
      rate: 90,

      // Реализация методов
      setTransactions: (t) => set({ transactions: t }),
      
      addTransaction: (t) => set((state) => ({ 
        transactions: [t, ...state.transactions] 
      })),

      removeTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id)
      })),

      setCategories: (c) => set({ categories: c }),
      
      setTheme: (t) => set({ theme: t }),
      setLang: (l) => set({ lang: l }),
      
      setCurrency: (c) => set({ currency: c }),
      setRate: (r) => set({ rate: r }),

      clearUserData: () => set({ transactions: [], categories: [] }),
    }),
    { 
      name: 'zen-finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);