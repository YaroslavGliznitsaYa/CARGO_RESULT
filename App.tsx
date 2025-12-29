import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchForm from './components/SearchForm/SearchForm';
import HistorySidebar from './components/Sidebar/HistorySidebar';
import ResultsList from './components/Results/ResultsList';
import AuthModal from './components/AuthModal';
import { useCargoSearch } from './hooks/useCargoSearch';
import { User, SearchHistoryItem } from './types';
import { CARGO_COMPANIES } from './constants';
import { mockDb } from './services/mockDb';

const App: React.FC = () => {
  // Состояние формы
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [weight, setWeight] = useState(1);
  const [declaredValue, setDeclaredValue] = useState(0);
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(10);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(CARGO_COMPANIES);

  // Поиск через хук
  const { offers, isSearching, search } = useCargoSearch();

  // История и авторизация
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    const savedUser = mockDb.getCurrentUser();
    if (savedUser) setUser(savedUser);

    const history = mockDb.getHistory(savedUser?.id);
    setSearchHistory(history);

    document.documentElement.classList.add('dark');
  }, []);

  // Авторизация через ВК (callback)
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

              // Загружаем личную историю
              const history = mockDb.getHistory(currentUser.id);
              setSearchHistory(history);

              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            }
          })
          .catch(() => {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          });
      }
    }
  }, []);

  // Обработчик поиска
  const handleSearch = () => {
    search({
      fromCity,
      toCity,
      weight,
      declaredValue,
      length,
      width,
      height,
      selectedCompanies,
    });

    // Сохраняем в историю (личную или гостевую)
    const history = mockDb.saveHistoryItem({
      fromCity,
      toCity,
      weight,
      declaredValue,
      companies: selectedCompanies,
    }, user?.id);

    setSearchHistory(history);
  };

  // Применение элемента истории
  const applyHistoryItem = (item: SearchHistoryItem) => {
    setFromCity(item.fromCity);
    setToCity(item.toCity);
    setWeight(item.weight);
    setDeclaredValue(item.declaredValue);
    setSelectedCompanies(item.companies);
    handleSearch();
  };

  // Смена городов
  const swapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  // Выход из аккаунта
  const handleLogout = () => {
    mockDb.setCurrentUser(null);
    setUser(null);
    // Загружаем гостевую историю
    const guestHistory = mockDb.getHistory();
    setSearchHistory(guestHistory);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <SearchForm
        fromCity={fromCity}
        setFromCity={setFromCity}
        toCity={toCity}
        setToCity={setToCity}
        weight={weight}
        setWeight={setWeight}
        declaredValue={declaredValue}
        setDeclaredValue={setDeclaredValue}
        length={length}
        setLength={setLength}
        width={width}
        setWidth={setWidth}
        height={height}
        setHeight={setHeight}
        selectedCompanies={selectedCompanies}
        setSelectedCompanies={setSelectedCompanies}
        onSearch={handleSearch}
        isSearching={isSearching}
        swapCities={swapCities}
      />

      <main className="max-w-7xl mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <HistorySidebar searchHistory={searchHistory} onApplyItem={applyHistoryItem} />

          <section className="lg:col-span-9">
            <ResultsList offers={offers} isSearching={isSearching} />
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setUser(user);
          const history = mockDb.getHistory(user.id);
          setSearchHistory(history);
        }}
      />
    </div>
  );
};

export default App;