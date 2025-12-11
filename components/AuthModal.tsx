
import React, { useState } from 'react';
import { User } from '../types';
import { mockDb } from '../services/mockDb';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(),
      email,
      name: email.split('@')[0],
      provider: 'email'
    };
    mockDb.setCurrentUser(newUser);
    onSuccess(newUser);
    onClose();
  };

  const handleSocialAuth = (provider: 'yandex' | 'vk') => {
    // Simulate social login redirect
    const newUser: User = {
      id: Math.random().toString(),
      email: `${provider}_user@example.com`,
      name: `${provider === 'yandex' ? 'Яндекс' : 'ВК'} Пользователь`,
      provider,
      avatar: `https://picsum.photos/seed/${provider}/100`
    };
    mockDb.setCurrentUser(newUser);
    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {mode === 'login' ? 'С возвращением' : 'Создать аккаунт'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => handleSocialAuth('yandex')}
              className="w-full flex items-center justify-center gap-3 bg-[#f33] hover:bg-[#d00] text-white py-3.5 rounded-2xl font-bold transition-all transform active:scale-95"
            >
              <i className="fab fa-yandex text-xl"></i>
              Войти через Яндекс
            </button>
            <button 
              onClick={() => handleSocialAuth('vk')}
              className="w-full flex items-center justify-center gap-3 bg-[#0077FF] hover:bg-[#0066DD] text-white py-3.5 rounded-2xl font-bold transition-all transform active:scale-95"
            >
              <i className="fab fa-vk text-xl"></i>
              Войти через ВК
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-bold tracking-widest">или через почту</span></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Электронная почта" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Пароль" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="ml-2 text-blue-600 font-bold hover:underline"
            >
              {mode === 'login' ? 'Создать' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
