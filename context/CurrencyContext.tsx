"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'TRY' | 'EUR' | 'USD' | 'GBP';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  rates: { [key: string]: number };
  formatPrice: (euroAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('EUR');
  const [rates, setRates] = useState({ TRY: 35.0, USD: 1.08, GBP: 0.85, EUR: 1 });

  useEffect(() => {
    // İnternetten canlı kurları çeker
    fetch('https://api.exchangerate-api.com/v4/latest/EUR')
      .then(res => res.json())
      .then(data => {
        setRates({
          TRY: data.rates.TRY,
          USD: data.rates.USD,
          GBP: data.rates.GBP,
          EUR: 1
        });
      }).catch(() => console.log("Canlı kurlar çekilemedi, sabit kurlar devrede."));

    // Kullanıcının ülkesine göre parayı otomatik seçer (TR -> TL gibi)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const country = data.country_code;
        if (country === 'TR') setCurrency('TRY');
        else if (country === 'GB') setCurrency('GBP');
        else if (['US', 'CA', 'AU'].includes(country)) setCurrency('USD');
        else setCurrency('EUR');
      }).catch(() => console.log("Ülke tespiti yapılamadı."));
  }, []);

  // Fiyatı süsleyip püsleyip gösteren fonksiyon (100 -> ₺3.500 gibi)
  const formatPrice = (euroAmount: number) => {
    const converted = euroAmount * rates[currency];
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency hatası!");
  return context;
};