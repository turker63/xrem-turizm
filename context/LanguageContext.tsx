"use client";

import React, { createContext, useContext, useState } from 'react';

const translations = {
  tr: {
    // NAVBAR
    home: "ANA SAYFA",
    fleet: "FİLOMUZ",
    services: "HİZMETLER",
    regions: "BÖLGELER",
    contact: "İLETİŞİM",
    sss: "SSS",

    // HERO & SEARCH FORM
    tagline: "PREMİUM TRANSFER DENEYİMİ",
    oneWay: "Tek Yön",
    roundTrip: "Gidiş - Dönüş",
    pickup: "ALIŞ NOKTASI",
    dropoff: "VARIŞ NOKTASI",
    date: "TARİH",
    time: "SAAT",
    passengers: "YOLCU",
    searchBtn: "Fiyat Ara & Rezervasyon Yap",
    placeholderPickup: "Havalimanı, Otel veya Adres...",
    placeholderDropoff: "Nereye gideceksiniz?",
    adult: "Yetişkin",
    child: "Çocuk",

    // AUTH (Üyelik & Giriş) - Yeni Eklenenler
    loginTitle: "ÜYE GİRİŞİ",
    registerTitle: "YENİ KAYIT",
    email: "E-POSTA ADRESİ",
    password: "ŞİFRE",
    loginBtn: "GİRİŞ YAP",
    registerBtn: "KAYIT OL",
    logoutBtn: "ÇIKIŞ YAP",
    profile: "PROFİLİM",
    noAccount: "Henüz hesabınız yok mu?",
    hasAccount: "Zaten üye misiniz?",
    forgotPassword: "Şifremi Unuttum",
    welcome: "Tekrar Hoş Geldiniz",
    errorEmail: "Lütfen geçerli bir e-posta girin.",
    errorPassword: "Şifre en az 6 karakter olmalıdır.",

    // SSS (Sıkça Sorulan Sorular)
    sssTitle: "Sıkça Sorulan Sorular",

    // FİLOMUZ (Fleet)
    fleetTitle: "ÖZEL VİP FİLOMUZ",
    fleetSub: "Konfor ve Güvenliğin Zirvesinde Yolculuk",
    capacity: "Kapasite",
    luggage: "Bagaj",
    wifi: "Ücretsiz Wi-Fi",
    drinks: "Soğuk İçecekler",
    bookNow: "Hemen Rezervasyon Yap",
  },
  en: {
    // NAVBAR
    home: "HOME",
    fleet: "FLEET",
    services: "SERVICES",
    regions: "REGIONS",
    contact: "CONTACT",
    sss: "FAQ",

    // HERO & SEARCH TABLE
    tagline: "PREMIUM TRANSFER EXPERIENCE",
    oneWay: "One Way",
    roundTrip: "Round Trip",
    pickup: "PICKUP LOCATION",
    dropoff: "DESTINATION",
    date: "DATE",
    time: "TIME",
    passengers: "PASSENGERS",
    searchBtn: "Search Price & Book Now",
    placeholderPickup: "Airport, Hotel or Address...",
    placeholderDropoff: "Where are you going?",
    adult: "Adult",
    child: "Child",

    // AUTH (Login & Register) - Added
    loginTitle: "USER LOGIN",
    registerTitle: "REGISTER",
    email: "EMAIL ADDRESS",
    password: "PASSWORD",
    loginBtn: "LOGIN",
    registerBtn: "REGISTER",
    logoutBtn: "LOGOUT",
    profile: "MY PROFILE",
    noAccount: "Don't have an account?",
    hasAccount: "Already a member?",
    forgotPassword: "Forgot Password?",
    welcome: "Welcome Back",
    errorEmail: "Please enter a valid email.",
    errorPassword: "Password must be at least 6 characters.",

    // FAQ
    sssTitle: "Frequently Asked Questions",

    // FLEET
    fleetTitle: "OUR EXCLUSIVE VIP FLEET",
    fleetSub: "Journey at the Peak of Comfort and Safety",
    capacity: "Capacity",
    luggage: "Luggage",
    wifi: "Free Wi-Fi",
    drinks: "Cold Drinks",
    bookNow: "Book Now",
  }
};

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('tr');
  const t = translations[lang as keyof typeof translations];
  const toggleLanguage = () => setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));

  return (
    <LanguageContext.Provider value={{ t, lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);