import { User, SearchHistoryItem } from '../types';

const STORAGE_KEY_USER = 'cargo_current_user';
const STORAGE_KEY_HISTORY_PREFIX = 'cargo_history_';

export const mockDb = {
  // Пользователь
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    return stored ? JSON.parse(stored) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
      // При выходе — очищаем только текущую историю (не всех)
    }
  },

  // История поиска — привязана к пользователю
  getHistory: (userId?: string): SearchHistoryItem[] => {
    const key = userId ? `${STORAGE_KEY_HISTORY_PREFIX}${userId}` : STORAGE_KEY_HISTORY_PREFIX + 'guest';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  saveHistoryItem: (item: Omit<SearchHistoryItem, 'id'>, userId?: string): SearchHistoryItem[] => {
    const key = userId ? `${STORAGE_KEY_HISTORY_PREFIX}${userId}` : STORAGE_KEY_HISTORY_PREFIX + 'guest';
    const history = mockDb.getHistory(userId);

    const newItem: SearchHistoryItem = {
      ...item,
      id: Date.now().toString(),
    };

    const updated = [newItem, ...history].slice(0, 20); // максимум 20 записей
    localStorage.setItem(key, JSON.stringify(updated));

    return updated;
  },

  clearHistory: (userId?: string) => {
    const key = userId ? `${STORAGE_KEY_HISTORY_PREFIX}${userId}` : STORAGE_KEY_HISTORY_PREFIX + 'guest';
    localStorage.removeItem(key);
  },
};