import React from 'react';
import { User } from '../../types';
import { mockDb } from '../../services/mockDb';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void; // добавляем пропс для logout
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogout }) => {
  return (
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
                onClick={onLogout}
                className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 group relative"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <i className="fas fa-sign-out-alt text-white"></i>
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-all active:scale-95"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;