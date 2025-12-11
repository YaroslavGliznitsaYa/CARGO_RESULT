
import React, { useState, useEffect, useRef } from 'react';
import { RUSSIAN_CITIES } from '../constants';
import { City } from '../types';

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    
    if (val.length >= 1) {
      const filtered = RUSSIAN_CITIES.filter(city => 
        city.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const selectSuggestion = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1 group" ref={containerRef}>
      <div className="px-4 py-2 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {icon && <i className={`${icon} text-slate-400 text-sm`}></i>}
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => value && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent border-none outline-none text-base font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-300"
          />
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-xl z-50 overflow-hidden">
          {suggestions.map((city) => (
            <div
              key={city.id}
              onClick={() => selectSuggestion(city.name)}
              className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition-colors flex items-center justify-between group/item"
            >
              <span className="text-slate-700 dark:text-slate-200 font-medium">{city.name}</span>
              <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">Выбрать</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
