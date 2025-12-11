
import React from 'react';
import { Offer } from '../types';

interface OfferCardProps {
  offer: Offer;
  isCheapest: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, isCheapest }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-xl group ${isCheapest ? 'ring-2 ring-green-500' : ''}`}>
      {isCheapest && (
        <div className="md:hidden bg-green-500 text-white text-[10px] font-bold py-1 px-3 text-center uppercase tracking-widest">
          Самый выгодный
        </div>
      )}
      
      <div className="flex-1 p-6 flex items-center gap-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-slate-50 dark:bg-slate-900`} style={{ color: offer.color }}>
          <i className={offer.logo}></i>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{offer.company}</h3>
            {offer.badge && (
              <span className="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {offer.badge}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><i className="fas fa-layer-group text-[10px]"></i> {offer.tariff}</span>
            <span className="flex items-center gap-1.5"><i className="fas fa-clock text-[10px]"></i> {offer.time}</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-56 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700">
        {isCheapest && (
          <div className="hidden md:block absolute -top-3 -left-3 bg-green-500 text-white text-[10px] font-bold py-1 px-3 rounded-lg shadow-lg uppercase tracking-widest origin-center -rotate-12">
            Выгодно
          </div>
        )}
        <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-4 tracking-tighter">
          {offer.price.toLocaleString()} ₽
        </div>
        <button 
          onClick={() => alert(`Переход на сайт ${offer.company}`)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          Выбрать
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
