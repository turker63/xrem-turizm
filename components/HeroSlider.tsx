"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';

const slidesData: any = {
  tr: [
    { id: 1, image: "/hizmetler/havalimani-transfer.jpg", subtitle: "XREM PREMIUM", title: "ANTALYA", titleAccent: "HAVALİMANI TRANSFER", desc: "Havalimanında isme özel VIP karşılama ve otelinize kadar lüks transfer deneyimi.", btnText: "ŞİMDİ REZERVASYON YAP", btnLink: "/arac-secimi?dep=Antalya Havalimanı (AYT)" },
    { id: 2, image: "/xrem-aqua.jpg", subtitle: "MAVİ YOLCULUK", title: "ÖZEL VIP", titleAccent: "YAT KİRALAMA", desc: "Akdeniz'in en güzel koylarında, sadece size özel beş yıldızlı konfor.", btnText: "YATLARI İNCELE", btnLink: "/hizmetler/vip-yat-kiralama" },
    { id: 3, image: "/hizmetler/vip-transfer.jpeg", subtitle: "LÜKS VE KONFOR", title: "ŞOFÖRLÜ", titleAccent: "VIP TAHSİS", desc: "7/24 hizmetinizde olan profesyonel şoförlü lüks araçlar.", btnText: "TEKLİF ALIN", btnLink: "/hizmetler/soforlu-arac-kiralama" }
  ],
  en: [
    { id: 1, image: "/hizmetler/havalimani-transfer.jpg", subtitle: "XREM PREMIUM", title: "ANTALYA", titleAccent: "AIRPORT TRANSFER", desc: "Personalized VIP welcome at the airport and luxury transfer to your hotel.", btnText: "BOOK NOW", btnLink: "/arac-secimi?dep=Antalya Havalimanı (AYT)" },
    { id: 2, image: "/xrem-aqua.jpg", subtitle: "BLUE CRUISE", title: "PRIVATE VIP", titleAccent: "YACHT CHARTER", desc: "Five-star comfort in the most beautiful bays of the Mediterranean.", btnText: "VIEW YACHTS", btnLink: "/hizmetler/vip-yat-kiralama" },
    { id: 3, image: "/hizmetler/vip-transfer.jpeg", subtitle: "LUXURY EXPERIENCE", title: "CHAUFFEURED", titleAccent: "VIP DISPOSAL", desc: "Professional chauffeured luxury vehicles at your service 24/7.", btnText: "GET A QUOTE", btnLink: "/hizmetler/soforlu-arac-kiralama" }
  ],
  de: [
    { id: 1, image: "/hizmetler/havalimani-transfer.jpg", subtitle: "XREM PREMIUM", title: "ANTALYA", titleAccent: "FLUGHAFENTRANSFER", desc: "Personalisierter VIP-Empfang am Flughafen und Luxustransfer zu Ihrem Hotel.", btnText: "JETZT BUCHEN", btnLink: "/arac-secimi?dep=Antalya Havalimanı (AYT)" },
    { id: 2, image: "/xrem-aqua.jpg", subtitle: "BLAUE REISE", title: "PRIVATE VIP", titleAccent: "YACHTCHARTER", desc: "Fünf-Sterne-Komfort in den schönsten Buchten des Mittelmeers.", btnText: "YACHTEN ANSEHEN", btnLink: "/hizmetler/vip-yat-kiralama" },
    { id: 3, image: "/hizmetler/vip-transfer.jpeg", subtitle: "LUXUSERFAHRUNG", title: "VIP-SERVICE", titleAccent: "MIT CHAUFFEUR", desc: "Professionelle Luxusfahrzeuge mit Chauffeur rund um die Uhr für Sie da.", btnText: "ANGEBOT ANFORDERN", btnLink: "/hizmetler/soforlu-arac-kiralama" }
  ],
  ru: [
    { id: 1, image: "/hizmetler/havalimani-transfer.jpg", subtitle: "XREM ПРЕМИУМ", title: "АНТАЛЬЯ", titleAccent: "ТРАНСФЕР ИЗ АЭРОПОРТА", desc: "Персональная VIP-встреча в аэропорту и роскошный трансфер до вашего отеля.", btnText: "ЗАБРОНИРОВАТЬ", btnLink: "/arac-secimi?dep=Antalya Havalimanı (AYT)" },
    { id: 2, image: "/xrem-aqua.jpg", subtitle: "ГОЛУБОЙ КРУИЗ", title: "ЧАСТНАЯ VIP", titleAccent: "АРЕНДА ЯХТ", desc: "Пятизвездочный комфорт в самых красивых бухтах Средиземного моря.", btnText: "ПОСМОТРЕТЬ ЯХТЫ", btnLink: "/hizmetler/vip-yat-kiralama" },
    { id: 3, image: "/hizmetler/vip-transfer.jpeg", subtitle: "ЛЮКСОВЫЙ ОПЫТ", title: "VIP УСЛУГИ", titleAccent: "С ШОФЕРОМ", desc: "Профессиональные автомобили представительского класса с водителем 24/7.", btnText: "ПОЛУЧИТЬ ПРЕДЛОЖЕНИЕ", btnLink: "/hizmetler/soforlu-arac-kiralama" }
  ]
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { lang } = useLanguage();
  const slides = slidesData[lang] || slidesData.en;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-[2px] bg-[#D4AF37]" />
              <span className="text-[11px] font-black text-[#D4AF37] tracking-[0.6em] uppercase">
                {slides[current].subtitle}
              </span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-light text-white uppercase tracking-tighter leading-[0.85] mb-10">
              {slides[current].title} <br />
              <span className="font-black text-[#D4AF37] italic">{slides[current].titleAccent}</span>
            </h1>
            
            <p className="text-sm md:text-lg text-white/80 font-medium uppercase tracking-[0.2em] leading-relaxed mb-12 max-w-xl">
              {slides[current].desc}
            </p>
            
            <Link 
              href={slides[current].btnLink}
              className="inline-flex items-center gap-5 bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-black px-12 py-6 rounded-full font-black uppercase text-[12px] tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 group"
            >
              {slides[current].btnText} 
              <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-500" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-40 right-6 md:right-20 z-20 flex gap-4">
        <button onClick={prevSlide} className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-xl hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all duration-500">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide} className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-xl hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all duration-500">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-white rounded-t-[5rem] md:rounded-t-[10rem] z-[15]" />
    </div>
  );
}