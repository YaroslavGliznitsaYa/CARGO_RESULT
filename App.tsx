import React, { useState, useEffect } from 'react';
import AutocompleteInput from './components/AutocompleteInput';
import OfferCard from './components/OfferCard';
import AuthModal from './components/AuthModal';
import { Offer, User, SearchHistoryItem } from './types';
import { CARGO_COMPANIES } from './constants';
import { mockDb } from './services/mockDb';

const App: React.FC = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [weight, setWeight] = useState(1);
  const [declaredValue, setDeclaredValue] = useState(0);
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(10);

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(CARGO_COMPANIES);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Принудительная тёмная тема + загрузка данных
  useEffect(() => {
    const savedUser = mockDb.getCurrentUser();
    if (savedUser) setUser(savedUser);

    const history = mockDb.getHistory();
    setSearchHistory(history);

    document.documentElement.classList.add('dark');
  }, []);

  // Авторизация через ВК
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const userId = params.get('user_id');

      if (accessToken && userId) {
        fetch(`https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_200&access_token=${accessToken}&v=5.199`)
          .then(res => res.json())
          .then(data => {
            if (data.response && data.response[0]) {
              const vkUser = data.response[0];

              const currentUser: User = {
                id: `vk_${userId}`,
                email: params.get('email') || '',
                name: `${vkUser.first_name} ${vkUser.last_name}`,
                provider: 'vk',
                avatar: vkUser.photo_200 || 'https://vk.com/images/camera_200.png'
              };

              mockDb.setCurrentUser(currentUser);
              setUser(currentUser);

              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            }
          })
          .catch(err => {
            console.error('Ошибка ВК:', err);
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          });
      }
    }
  }, []);

  // Вспомогательные функции
  const getCompanyName = (key: string) => {
    const map: Record<string, string> = {
      cdek: 'СДЭК',
      boxberry: 'Boxberry',
      rupost: 'Почта России',
      dellin: 'Деловые Линии',
    };
    return map[key] || key.toUpperCase();
  };

  const getLogoForCompany = (key: string) => {
    const map: Record<string, string> = {
      cdek: 'fas fa-bolt',
      boxberry: 'fas fa-box-open',
      rupost: 'fas fa-envelope',
      dellin: 'fas fa-truck',
    };
    return map[key] || 'fas fa-truck-loading';
  };

  const getColorForCompany = (key: string) => {
    const map: Record<string, string> = {
      cdek: '#81c784',
      boxberry: '#e57373',
      rupost: '#64b5f6',
      dellin: '#ffb74d',
    };
    return map[key] || '#94a3b8';
  };

  const getFallbackOffers = (): Offer[] => {
    return [
      {
        id: 'fallback-1',
        company: 'СДЭК',
        tariff: 'Посылочка',
        price: 450 + Math.round(weight * 50),
        time: '2-3 дня',
        badge: 'Ориентировочно',
        logo: 'fas fa-bolt',
        color: '#81c784',
        fromCity,
        toCity,
        weight,
        declaredValue,
        length,
        width,
        height
      },
      // Можно добавить ещё, но и одного достаточно
    ].filter(o => selectedCompanies.includes(o.company));
  };

  // Основной поиск с ApiShip
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fromCity || !toCity) return;

    setIsSearching(true);

    const historyItem = mockDb.saveHistoryItem({
      fromCity,
      toCity,
      weight,
      declaredValue,
      companies: selectedCompanies
    });
    setSearchHistory(historyItem);

    try {
      const response = await fetch('https://api.apiship.ru/v1/calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'f07bef35ec1781d4793b571409bdcb2a',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          from: { city: fromCity.trim() },
          to: { city: toCity.trim() },
          weight: weight * 1000,
          length,
          width,
          height,
          assessedCost: declaredValue || 0
        })
      });

      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        setOffers(getFallbackOffers());
        return;
      }

      if (data.length === 0) {
        setOffers(getFallbackOffers());
        return;
      }

      const apiOffers: Offer[] = data.map((item: any) => {
        const key = item.providerKey?.toLowerCase() || '';
        return {
          id: item.id || Math.random().toString(),
          company: getCompanyName(key),
          tariff: item.tariffName || 'Стандарт',
          price: Math.round(item.cost || 0),
          time: item.deliveryTimeMin && item.deliveryTimeMax
            ? `${item.deliveryTimeMin}–${item.deliveryTimeMax} дней`
            : 'Не указано',
          logo: getLogoForCompany(key),
          color: getColorForCompany(key),
          fromCity,
          toCity,
          weight,
          declaredValue,
          length,
          width,
          height
        };
      });

      const filtered = apiOffers
        .filter(o => selectedCompanies.includes(o.company))
        .sort((a, b) => a.price - b.price);

      setOffers(filtered);
    } catch (err) {
      console.warn('ApiShip недоступен — показываем ориентировочные цены');
      setOffers(getFallbackOffers());
    } finally {
      setIsSearching(false);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const applyHistoryItem = (item: SearchHistoryItem) => {
    setFromCity(item.fromCity);
    setToCity(item.toCity);
    setWeight(item.weight);
    setDeclaredValue(item.declaredValue);
    setSelectedCompanies(item.companies);
    setTimeout(() => handleSearch(), 100);
  };

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <nav className="fixed top-0 w-full z-[80] bg-blue-600 dark:bg-slate-900 border-b border-white/10 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-blue-600 rounded-xl flex items-center justify-center text-blue-600 dark:text-white font-black text-2xl shadow-lg">
              C
            </div>
            <span className="text-xl font-black text-white tracking-tight">ARGO</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 pl-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white/70 uppercase">Личный кабинет</div>
                  <div className="text-sm font-bold text-white">{user.name}</div>
                </div>
                <button
                  onClick={() => {
                    mockDb.setCurrentUser(null);
                    setUser(null);
                  }}
                  className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 group relative"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt="avatar"
                  />
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <i className="fas fa-sign-out-alt text-white"></i>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-all active:scale-95"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero & Search */}
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
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-1 border border-white/10">
              <div className="flex-1 flex flex-col sm:flex-row relative">
                <AutocompleteInput label="Откуда" value={fromCity} onChange={setFromCity} placeholder="Город отправления" icon="fas fa-map-marker-alt" />
                <button type="button" onClick={swapCities} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:rotate-180 transition-all border-4 border-white dark:border-slate-800">
                  <i className="fas fa-exchange-alt text-[10px]"></i>
                </button>
                <AutocompleteInput label="Куда" value={toCity} onChange={setToCity} placeholder="Город назначения" icon="fas fa-location-arrow" />
              </div>
              <div className="flex flex-col sm:flex-row flex-[0.7] divide-x divide-slate-100 dark:divide-slate-700">
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Вес (кг)</label>
                  <input type="number" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value) || 1)} className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white" />
                </div>
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ценность (₽)</label>
                  <input type="number" min="0" value={declaredValue} onChange={(e) => setDeclaredValue(parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row flex-[1] divide-x divide-slate-100 dark:divide-slate-700 mt-4 sm:mt-0">
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Длина (см)</label>
                  <input type="number" min="1" value={length} onChange={(e) => setLength(parseFloat(e.target.value) || 30)} className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white" />
                </div>
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ширина (см)</label>
                  <input type="number" min="1" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 20)} className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white" />
                </div>
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Высота (см)</label>
                  <input type="number" min="1" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 10)} className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white" />
                </div>
              </div>
              <button type="submit" disabled={isSearching} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSearching ? <i className="fas fa-spinner fa-spin"></i> : 'Найти'}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {CARGO_COMPANIES.map(company => (
                <label key={company} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-2 flex items-center gap-2 ${selectedCompanies.includes(company) ? 'bg-white/10 border-white/40 text-white' : 'bg-transparent border-white/10 text-white/40 hover:text-white/60'}`}>
                  <input type="checkbox" className="hidden" checked={selectedCompanies.includes(company)} onChange={() => {
                    setSelectedCompanies(prev => prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]);
                  }} />
                  {selectedCompanies.includes(company) && <i className="fas fa-check text-[8px]"></i>}
                  {company}
                </label>
              ))}
            </div>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">История поиска</h3>
                <i className="fas fa-history text-slate-300"></i>
              </div>
              <div className="space-y-4">
                {searchHistory.length > 0 ? (
                  searchHistory.map(item => (
                    <button key={item.id} onClick={() => applyHistoryItem(item)} className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group">
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
                <button onClick={() => {
                  mockDb.clearHistory();
                  setSearchHistory([]);
                }} className="w-full mt-6 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                  Очистить историю
                </button>
              )}
            </div>
          </aside>

          <section className="lg:col-span-9">
            {isSearching ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700"></div>
                ))}
              </div>
            ) : offers.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Найденные варианты ({offers.length})
                  </h2>
                </div>
                {offers.map((offer, index) => (
                  <OfferCard key={offer.id} offer={offer} isCheapest={index === 0} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-[40px] p-20 text-center shadow-2xl border border-slate-100 dark:border-slate-700">
                <div className="w-24 h-24 bg-blue-50 dark:bg-slate-900 rounded-[30px] flex items-center justify-center mx-auto mb-8 text-blue-500 text-3xl shadow-inner">
                  <i className="fas fa-truck-loading"></i>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Готовы к поиску?</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                  Введите города отправления и назначения, чтобы увидеть актуальные тарифы лучших перевозчиков страны.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-slate-100 dark:bg-slate-950 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <i className="fab fa-cc-visa text-3xl"></i>
            <i className="fab fa-cc-mastercard text-3xl"></i>
            <i className="fab fa-cc-apple-pay text-3xl"></i>
            <i className="fab fa-google-pay text-3xl"></i>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest mb-2">© 2025 CArgo — Поиск лучших грузоперевозок</p>
          <p className="text-slate-400 dark:text-slate-600 text-[10px]">Все права защищены. Цены не являются публичной офертой.</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(user) => setUser(user)} />
    </div>
  );
};

export default App;