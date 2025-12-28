import React from 'react';
import { Offer } from '../types';

const OfferCard: React.FC<{ offer: Offer; isCheapest?: boolean }> = ({ offer, isCheapest }) => {
  const getCalculatorUrl = (offer: Offer) => {
  const { company } = offer;

  switch (company) {
    case 'СДЭК':
      return 'https://www.cdek.ru/ru/calculate';
    case 'Boxberry':
      return 'https://boxberry.ru/calculator/';
    case 'Почта России':
      return 'https://www.pochta.ru/parcels';
    case 'Деловые Линии':
      return 'https://www.dellin.ru/requests/';
    default:
      return 'https://www.cdek.ru/ru/calculate'; // fallback
  }
};

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
      {isCheapest && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm">
          Самый дешёвый
        </div>
      )}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: offer.color }}>
            <i className={offer.logo}></i>
        </div>
        <div>
          <h3 className="font-black text-xl text-slate-900 dark:text-white">{offer.company}</h3>
          <p className="text-slate-500 dark:text-slate-400">{offer.tariff}</p>
        </div>
      </div>
      <div className="mb-6">
        <div className="text-4xl font-black text-slate-900 dark:text-white">от {offer.price} ₽</div>
        <div className="text-slate-500 dark:text-slate-400">{offer.time}</div>
      </div>
      {offer.badge && (
        <span className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold">
          {offer.badge}
        </span>
      )}
      {/* Кнопка перехода на официальный калькулятор */}
      <div className="mt-6">
        <a
          href={getCalculatorUrl(offer)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          Оформить на сайте {offer.company} →
        </a>
      </div>
    </div>
  );
};

export default OfferCard;