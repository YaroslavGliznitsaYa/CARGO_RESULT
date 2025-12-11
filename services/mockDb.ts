
import { SearchHistoryItem, User } from '../types';

const KEYS = {
  HISTORY: 'cargo_search_history',
  USER: 'cargo_current_user',
  USERS_DB: 'cargo_users_database'
};

export const mockDb = {
  getHistory: (): SearchHistoryItem[] => {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  saveHistoryItem: (item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
    const history = mockDb.getHistory();
    const newItem: SearchHistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const updated = [newItem, ...history].slice(0, 10); // Keep last 10
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  },

  clearHistory: () => {
    localStorage.removeItem(KEYS.HISTORY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  }
};
