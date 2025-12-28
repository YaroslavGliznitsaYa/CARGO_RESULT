
export interface City {
  id: string;
  name: string;
  region?: string;
}

export interface SearchParams {
  fromCity: string;
  toCity: string;
  weight: number;
  declaredValue: number;
  companies: string[];
}

export interface Offer {
  id: string;
  company: string;
  tariff: string;
  price: number;
  time: string;
  badge?: string;
  logo: string;
  color: string;
  fromCity: string;     // <-- добавь
  toCity: string;       // <-- добавь
  weight: number;       // <-- добавь
  declaredValue: number; // <-- добавь
  length: number;
  width: number;
  height: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'email' | 'yandex' | 'vk';
}

export interface SearchHistoryItem extends SearchParams {
  id: string;
  timestamp: number;
}
