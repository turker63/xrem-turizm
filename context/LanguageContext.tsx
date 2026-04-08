"use client";

import React, { createContext, useContext, useState } from 'react';

const translations = {
  tr: {
    // Navigasyon
    home: "ANA SAYFA",
    fleet: "FİLOMUZ",
    services: "HİZMETLER",
    regions: "BÖLGELER",
    contact: "İLETİŞİM",
    sss: "SSS",

    // Arama Formu
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

    // Üyelik & Profil
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

    // SSS
    sssTitle: "Sıkça Sorulan Sorular",

    // Filo Detayları
    fleetTitle: "ÖZEL VİP FİLOMUZ",
    fleetSub: "Konfor ve Güvenliğin Zirvesinde Yolculuk",
    capacity: "Kapasite",
    luggage: "Bagaj",
    wifi: "Ücretsiz Wi-Fi",
    drinks: "Soğuk İçecekler",
    bookNow: "Hemen Rezervasyon Yap",

    // Ek Etiketler (Form İçin)
    departureLabel: "(Gidiş)",
    returnLabel: "(Dönüş)",
    returnPickupPlaceholder: "Dönüş Alış Noktası",
    returnDropoffPlaceholder: "Dönüş Varış Noktası",
    select: "Seçiniz",
    returnDate: "DÖNÜŞ TARİHİ",
    timeLabel: "SAAT",

    // Genel Butonlar
    viewAll: "Tümünü Gör",
    readMore: "Devamını Oku",
    contactUs: "Bize Ulaşın",
    whatsappSupport: "WhatsApp Destek",

    // Bölüm Başlıkları
    servicesTitle: "Hizmetlerimiz",
    servicesSubtitle: "Size Özel Premium Transfer Çözümleri",
    featuresTitle: "Neden Bizi Seçmelisiniz?",
    featuresSubtitle: "Sizi özel hissettirecek ayrıcalıklarımız",
    statsTitle: "Rakamlarla Biz",
    howItWorksTitle: "Nasıl Çalışır?",
    howItWorksSubtitle: "3 Basit Adımda Transferinizi Planlayın",
    faqTitle: "Sıkça Sorulan Sorular",
    testimonialsTitle: "Müşteri Yorumları",
    promoTitle: "Özel İndirimler",

    // Footer & Kurumsal
    footerAboutTitle: "Hakkımızda",
    footerLinksTitle: "Hızlı Linkler",
    footerContactTitle: "İletişim",
    rightsReserved: "Tüm Hakları Saklıdır.",
    corporate: "Kurumsal",
    policies: "Politikalar",
    operation: "7/24 Operasyon",
    footerRights: "TÜM HAKLARI SAKLIDIR.",
    securePayment: "256-BIT SSL GÜVENLİ ÖDEME SİSTEMİ",
    faqTitle1: "MERAK",
    faqTitle2: "EDİLENLER",
    faqSubtitle: "Aklınızdaki Tüm Soruların Cevapları",
  },
  en: {
    // Navigation
    home: "HOME",
    fleet: "FLEET",
    services: "SERVICES",
    regions: "REGIONS",
    contact: "CONTACT",
    sss: "FAQ",

    // Search Form
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

    // Auth & Profile
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

    // Fleet Details
    fleetTitle: "OUR EXCLUSIVE VIP FLEET",
    fleetSub: "Journey at the Peak of Comfort and Safety",
    capacity: "Capacity",
    luggage: "Luggage",
    wifi: "Free Wi-Fi",
    drinks: "Cold Drinks",
    bookNow: "Book Now",

    // Extra Labels
    departureLabel: "(Departure)",
    returnLabel: "(Return)",
    returnPickupPlaceholder: "Return Pickup Location",
    returnDropoffPlaceholder: "Return Dropoff Location",
    select: "Select",
    returnDate: "RETURN DATE",
    timeLabel: "TIME",

    // General Buttons
    viewAll: "View All",
    readMore: "Read More",
    contactUs: "Contact Us",
    whatsappSupport: "WhatsApp Support",

    // Section Titles
    servicesTitle: "Our Services",
    servicesSubtitle: "Premium Transfer Solutions Tailored For You",
    featuresTitle: "Why Choose Us?",
    featuresSubtitle: "Privileges that make you feel special",
    statsTitle: "Us in Numbers",
    howItWorksTitle: "How It Works?",
    howItWorksSubtitle: "Plan Your Transfer in 3 Simple Steps",
    faqTitle: "Frequently Asked Questions",
    testimonialsTitle: "Testimonials",
    promoTitle: "Special Offers",

    // Footer & Corporate
    footerAboutTitle: "About Us",
    footerLinksTitle: "Quick Links",
    footerContactTitle: "Contact",
    rightsReserved: "All Rights Reserved.",
    corporate: "Corporate",
    policies: "Policies",
    operation: "24/7 Operation",
    footerRights: "ALL RIGHTS RESERVED.",
    securePayment: "256-BIT SSL SECURE PAYMENT SYSTEM",
    faqTitle1: "FREQUENTLY",
    faqTitle2: "ASKED QUESTIONS",
    faqSubtitle: "Answers to All Your Questions",
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