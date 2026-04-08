"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/hizmetler/havalimani-transfer.jpg",
      subtitle: "XREM PREMIUM",
      title: "HAVALİMANI",
      titleAccent: "VIP TRANSFER",
      desc: "Havalimanında isme özel VIP karşılama ve otelinize kadar sarsıntısız, güvenli lüks transfer deneyimi.",
      btnText: "REZERVASYON YAP",
      btnLink: "/arac-secimi?dep=Antalya Havalimanı (AYT)"
    },
    {
      id: 2,
      image: "/xrem-aqua.jpg",
      subtitle: "MAVİLİKLERE AÇILIN",
      title: "VIP YAT",
      titleAccent: "KİRALAMA",
      desc: "Akdeniz'in en güzel koylarında, sadece size ve sevdiklerinize özel, beş yıldızlı otel konforunda unutulmaz bir gün.",
      btnText: "YATLARIMIZI İNCELE",
      btnLink: "/hizmetler/vip-yat-kiralama"
    },
    {
      id: 3,
      image: "/hizmetler/vip-transfer.jpeg",
      subtitle: "LÜKS VE KONFOR",
      title: "ÖZEL VIP",
      titleAccent: "TRANSFER",
      desc: "Size özel tasarlanmış VIP araçlarımızla dilediğiniz her lokasyona ayrıcalıklı ve konforlu seyahat ayrıcalığı.",
      btnText: "DETAYLARI İNCELE",
      btnLink: "/hizmetler/vip-transfer"
    },
    {
      id: 4,
      image: "/hizmetler/soforlu-arac-kiralama.jpeg",
      subtitle: "SINIR TANIMAYAN KONFOR",
      title: "ŞOFÖRLÜ ARAÇ",
      titleAccent: "TAHSİSİ",
      desc: "Günlük veya saatlik tahsis edilen şoförlü lüks araçlarla şehir içi ve şehir dışı prestijli ulaşım çözümleri.",
      btnText: "TEKLİF ALIN",
      btnLink: "/hizmetler/soforlu-arac-kiralama"
    },
    {
      id: 5,
      image: "/hizmetler/kongre-fuar-tasimaciligi.jpg",
      subtitle: "KURUMSAL ÇÖZÜMLER",
      title: "KONGRE VE FUAR",
      titleAccent: "TAŞIMACILIĞI",
      desc: "Kurumsal etkinlikleriniz ve davetleriniz için profesyonel, zamanında ve kusursuz planlanmış ulaşım çözümleri.",
      btnText: "İLETİŞİME GEÇ",
      btnLink: "/hizmetler/kongre-fuar-tasimaciligi"
    },
    {
      id: 6,
      image: "/hizmetler/tur-tasima.jpeg",
      subtitle: "KEŞFETMEYE HAZIR OLUN",
      title: "ÖZEL TUR",
      titleAccent: "TAŞIMACILIĞI",
      desc: "Bölgenin tarihi ve turistik lokasyonlarına, tamamen size özel hazırlanan rotalarla güvenli ve lüks gezi.",
      btnText: "ROTALARI İNCELE",
      btnLink: "/hizmetler/ozel-tur-tasima"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[85vh] min-h-[650px] overflow-hidden bg-black flex items-center justify-center">
      
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream/90" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col justify-center h-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-gold" />
              <span className="text-[10px] md:text-xs font-black text-gold tracking-[0.5em] uppercase">
                {slides[current].subtitle}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-6 drop-shadow-2xl">
              {slides[current].title} <br />
              <span className="text-gold">{slides[current].titleAccent}</span>
            </h1>
            
            <p className="text-sm md:text-base text-gray-200 font-medium uppercase tracking-widest leading-relaxed mb-10 max-w-xl">
              {slides[current].desc}
            </p>
            
            <Link 
              href={slides[current].btnLink}
              className="inline-flex items-center gap-3 bg-gold hover:bg-white text-luxury-dark px-10 py-5 rounded-full font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95"
            >
              {slides[current].btnText} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-32 right-6 md:right-12 z-20 flex gap-4">
        <button 
          onClick={prevSlide}
          className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-md hover:bg-gold hover:border-gold hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-md hover:bg-gold hover:border-gold hover:text-black transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-12 left-6 md:left-auto md:right-12 z-20 flex gap-3 items-center">
        <span className="text-white font-black text-xs">0{current + 1}</span>
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                current === idx ? "w-8 bg-gold" : "w-3 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <span className="text-white/50 font-black text-xs">0{slides.length}</span>
      </div>
    </div>
  );
}