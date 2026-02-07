import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Функция для определения начальной темы с учётом системных настроек
function getInitialTheme(): 'light' | 'dark' {
  // Сначала проверяем localStorage (сохранённые настройки пользователя)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('zen-finance-storage');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.state && (data.state.theme === 'dark' || data.state.theme === 'light')) {
          return data.state.theme;
        }
      }
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
  }
  // Если в localStorage нет темы, используем системные настройки
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

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

// Инициализируем тему один раз при загрузке модуля
const initialTheme = typeof window !== 'undefined' ? getInitialTheme() : 'light';

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      // Начальные состояния
      transactions: [],
      categories: [],
      theme: initialTheme,
      lang: 'ru',
      currency: 'RUB',
      rate: 90, // Значение по умолчанию, обновится из API на главной

      // Реализация методов
      setTransactions: (t) => set({ transactions: t }),
      
      // Добавляет новую транзакцию в начало списка (важно для мгновенного обновления истории)
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
      name: 'zen-finance-storage', // Ключ в localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);