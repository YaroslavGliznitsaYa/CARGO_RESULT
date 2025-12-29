import { useState } from 'react';
import { Offer } from '../types';

const API_SHIP_TOKEN = 'f07bef35ec1781d4793b571409bdcb2a';

const getCompanyName = (key: string): string => {
  const map: Record<string, string> = {
    cdek: 'СДЭК',
    boxberry: 'Boxberry',
    rupost: 'Почта России',
    dellin: 'Деловые Линии',
    pecom: 'ПЭК',
    nrg: 'Энергия',
  };
  return map[key.toLowerCase()] || key.toUpperCase();
};

const getLogoUrl = (company: string): string => {
  const map: Record<string, string> = {
    'СДЭК': 'https://www.cdek.ru/storage/source/1/c/d/e/k/cdek-logo.svg',
    'Boxberry': 'https://boxberry.ru/upload/iblock/2c6/boxberry_logo.svg',
    'Почта России': 'https://www.pochta.ru/static/images/logo.svg',
    'Деловые Линии': 'https://www.dellin.ru/static/img/logo.svg',
    'ПЭК': 'https://pecom.ru/upload/iblock/2e3/pecom_logo.svg',
    'Энергия': 'https://nrg-tk.ru/upload/iblock/0b4/nrg_logo.svg',
  };
  return map[company] || 'https://via.placeholder.com/80?text=Logo';
};

export const useCargoSearch = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async (params: {
    fromCity: string;
    toCity: string;
    weight: number;
    declaredValue: number;
    length: number;
    width: number;
    height: number;
    selectedCompanies: string[];
  }) => {
    setIsSearching(true);
    setOffers([]);

    let hasRealOffers = false;

    try {
      const response = await fetch('https://api.apiship.ru/v1/calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_SHIP_TOKEN,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          from: { city: params.fromCity.trim() },
          to: { city: params.toCity.trim() },
          weight: params.weight * 1000,
          length: params.length,
          width: params.width,
          height: params.height,
          assessedCost: params.declaredValue || 0,
        }),
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        const apiOffers: Offer[] = data.map((item: any) => {
          const company = getCompanyName(item.providerKey || '');
          return {
            id: item.id || Math.random().toString(),
            company,
            tariff: item.tariffName || 'Стандарт',
            price: Math.round(item.cost || 0),
            time: item.deliveryTimeMin && item.deliveryTimeMax
              ? `${item.deliveryTimeMin}–${item.deliveryTimeMax} дней`
              : 'Не указано',
            logo: getLogoUrl(company),
            fromCity: params.fromCity,
            toCity: params.toCity,
            weight: params.weight,
            declaredValue: params.declaredValue,
            length: params.length,
            width: params.width,
            height: params.height,
          };
        });

        const filtered = apiOffers
          .filter(o => params.selectedCompanies.includes(o.company))
          .sort((a, b) => a.price - b.price);

        if (filtered.length > 0) {
          setOffers(filtered);
          hasRealOffers = true;
        }
      }
    } catch (err) {
      console.warn('ApiShip недоступен');
    }

    // Fallback: если ничего не нашлось — показываем ориентировочные
    if (!hasRealOffers) {
      const basePrice = 800 + params.weight * 60 + Math.round((params.length + params.width + params.height) * 10);

      const fallback: Offer[] = [
        { company: 'СДЭК', price: basePrice, time: '3-5 дней' },
        { company: 'Boxberry', price: Math.round(basePrice * 1.15), time: '5-8 дней' },
        { company: 'Почта России', price: Math.round(basePrice * 0.7), time: '10-20 дней' },
        { company: 'Деловые Линии', price: Math.round(basePrice * 0.9), time: '7-12 дней' },
        { company: 'ПЭК', price: Math.round(basePrice * 0.85), time: '6-10 дней' },
        { company: 'Энергия', price: Math.round(basePrice * 0.95), time: '8-14 дней' },
      ]
        .filter(o => params.selectedCompanies.includes(o.company))
        .map(o => ({
          id: 'fallback-' + o.company,
          company: o.company,
          tariff: 'Стандарт',
          price: o.price,
          time: o.time,
          badge: 'Ориентировочно',
          logo: getLogoUrl(o.company),
          fromCity: params.fromCity,
          toCity: params.toCity,
          weight: params.weight,
          declaredValue: params.declaredValue,
          length: params.length,
          width: params.width,
          height: params.height,
        }))
        .sort((a, b) => a.price - b.price);

      setOffers(fallback);
    }

    setIsSearching(false);
  };

  return { offers, isSearching, search };
};