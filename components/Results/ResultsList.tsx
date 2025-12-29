import React, { useState } from 'react';
import OfferCard from '../OfferCard';
import { Offer } from '../../types';

interface ResultsListProps {
  offers: Offer[];
  isSearching: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ offers, isSearching }) => {
  const [sortBy, setSortBy] = useState<'price' | 'time'>('price');

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    // Сортировка по времени — извлекаем минимальное время
    const getMinTime = (time: string) => {
      const match = time.match(/(\d+)/);
      return match ? parseInt(match[1]) : Infinity;
    };
    return getMinTime(a.time) - getMinTime(b.time);
  });

  if (isSearching) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700"></div>
        ))}
      </div>
    );
  }

  if (sortedOffers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-[40px] p-20 text-center shadow-2xl border border-slate-100 dark:border-slate-700">
        <div className="w-24 h-24 bg-blue-50 dark:bg-slate-900 rounded-[30px] flex items-center justify-center mx-auto mb-8 text-blue-500 text-3xl shadow-inner">
          <i className="fas fa-search"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Нет доступных тарифов</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
          Попробуйте изменить параметры поиска или город назначения.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Найденные варианты ({sortedOffers.length})
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold uppercase">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'time')}
            className="bg-transparent text-sm font-bold text-blue-600 dark:text-blue-400 outline-none border-b-2 border-blue-600 dark:border-blue-400 pb-1"
          >
            <option value="price">По цене</option>
            <option value="time">По времени</option>
          </select>
        </div>
      </div>
      {sortedOffers.map((offer, index) => (
        <OfferCard key={offer.id} offer={offer} isCheapest={index === 0} />
      ))}
    </div>
  );
};

export default ResultsList;