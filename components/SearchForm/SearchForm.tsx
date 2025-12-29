import React from 'react';
import AutocompleteInput from '../AutocompleteInput';
import { CARGO_COMPANIES } from '../../constants';

interface SearchFormProps {
  fromCity: string;
  setFromCity: (value: string) => void;
  toCity: string;
  setToCity: (value: string) => void;
  weight: number;
  setWeight: (value: number) => void;
  declaredValue: number;
  setDeclaredValue: (value: number) => void;
  length: number;
  setLength: (value: number) => void;
  width: number;
  setWidth: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  selectedCompanies: string[];
  setSelectedCompanies: (value: string[]) => void;
  onSearch: () => void;
  isSearching: boolean;
  swapCities: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  weight,
  setWeight,
  declaredValue,
  setDeclaredValue,
  length,
  setLength,
  width,
  setWidth,
  height,
  setHeight,
  selectedCompanies,
  setSelectedCompanies,
  onSearch,
  isSearching,
  swapCities,
}) => {
  return (
    <section className="bg-blue-600 dark:bg-slate-900 pt-32 pb-48 px-4 transition-all overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-white blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 blur-3xl rounded-full"></div>
      </div>
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
          Тут находят дешевую <br className="hidden md:block"/> грузоперевозку
        </h1>
        <p className="text-blue-100 dark:text-slate-400 text-lg mb-12 font-medium opacity-80">
          Сравниваем цены СДЭК, Boxberry, Почты и других за пару секунд
        </p>
        <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-1 border border-white/10">
            <div className="flex-1 flex flex-col sm:flex-row relative">
              <AutocompleteInput
                label="Откуда"
                value={fromCity}
                onChange={setFromCity}
                placeholder="Город отправления"
                icon="fas fa-map-marker-alt"
              />
              <button
                type="button"
                onClick={swapCities}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:rotate-180 transition-all border-4 border-white dark:border-slate-800"
              >
                <i className="fas fa-exchange-alt text-[10px]"></i>
              </button>
              <AutocompleteInput
                label="Куда"
                value={toCity}
                onChange={setToCity}
                placeholder="Город назначения"
                icon="fas fa-location-arrow"
              />
            </div>
            <div className="flex flex-col sm:flex-row flex-[0.7] divide-x divide-slate-100 dark:divide-slate-700">
              <div className="flex-1 px-4 py-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Вес (кг)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex-1 px-4 py-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ценность (₽)</label>
                <input
                  type="number"
                  min="0"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-[1] divide-x divide-slate-100 dark:divide-slate-700 mt-4 sm:mt-0">
              <div className="flex-1 px-4 py-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Длина (см)</label>
                <input
                  type="number"
                  min="1"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 30)}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex-1 px-4 py-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ширина (см)</label>
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 20)}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex-1 px-4 py-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Высота (см)</label>
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 10)}
                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>
            <button
  type="submit"
  disabled={isSearching || !fromCity.trim() || !toCity.trim()}
  className={`bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-500/20 active:scale-95 ${
    isSearching || !fromCity.trim() || !toCity.trim()
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-orange-600'
  }`}
>
  {isSearching ? <i className="fas fa-spinner fa-spin"></i> : 'Найти'}
</button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CARGO_COMPANIES.map(company => (
              <label
                key={company}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-2 flex items-center gap-2 ${
                  selectedCompanies.includes(company)
                    ? 'bg-white/10 border-white/40 text-white'
                    : 'bg-transparent border-white/10 text-white/40 hover:text-white/60'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCompanies.includes(company)}
                  onChange={() => {
                    setSelectedCompanies(prev =>
                      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
                    );
                  }}
                />
                {selectedCompanies.includes(company) && <i className="fas fa-check text-[8px]"></i>}
                {company}
              </label>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchForm;