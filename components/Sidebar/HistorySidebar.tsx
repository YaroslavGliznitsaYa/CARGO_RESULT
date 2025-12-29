import React from 'react';
import { SearchHistoryItem } from '../../types';
import { mockDb } from '../../services/mockDb';

interface HistorySidebarProps {
  searchHistory: SearchHistoryItem[];
  onApplyItem: (item: SearchHistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ searchHistory, onApplyItem }) => {
  const handleClearHistory = () => {
    mockDb.clearHistory();
    window.location.reload(); // простая перезагрузка для очистки состояния
  };

  return (
    <aside className="lg:col-span-3">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">История поиска</h3>
          <i className="fas fa-history text-slate-300"></i>
        </div>
        <div className="space-y-4">
          {searchHistory.length > 0 ? (
            searchHistory.map(item => (
              <button
                key={item.id}
                onClick={() => onApplyItem(item)}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate flex-1">
                    {item.fromCity} <i className="fas fa-arrow-right text-[8px] mx-1 opacity-40"></i> {item.toCity}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  {item.weight} кг • {item.declaredValue} ₽
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                <i className="fas fa-search"></i>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">
                Здесь появятся ваши прошлые маршруты
              </p>
            </div>
          )}
        </div>
        {searchHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="w-full mt-6 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Очистить историю
          </button>
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;