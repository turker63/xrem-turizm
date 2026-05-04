"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { Users, Car, MapPin, Star } from "lucide-react";

const statsData = {
  tr: [
    { id: 1, label: "MUTLU MÜŞTERİ", value: 15000, suffix: "+", icon: Users },
    { id: 2, label: "YILLIK TRANSFER", value: 8500, suffix: "+", icon: Car },
    { id: 3, label: "DESTEKLENEN ROTA", value: 120, suffix: "+", icon: MapPin },
    { id: 4, label: "MÜŞTERİ PUANI", value: 4.9, suffix: "/5", icon: Star },
  ],
  en: [
    { id: 1, label: "HAPPY CLIENTS", value: 15000, suffix: "+", icon: Users },
    { id: 2, label: "ANNUAL TRANSFERS", value: 8500, suffix: "+", icon: Car },
    { id: 3, label: "SUPPORTED ROUTES", value: 120, suffix: "+", icon: MapPin },
    { id: 4, label: "CUSTOMER RATING", value: 4.9, suffix: "/5", icon: Star },
  ]
};

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000; 
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start * 10) / 10);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count % 1 === 0 ? count : count.toFixed(1)}{suffix}</span>;
};

export default function Stats() {
  const { lang } = useLanguage();
  const currentStats = lang === 'en' ? statsData.en : statsData.tr;

  return (
    <section className="relative z-10 w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* TEK RENK PANEL: Görseldeki gibi sade, net ve yüksek görünürlük */}
        <div className="bg-[#FAF7F2] rounded-[3rem] md:rounded-[6rem] border border-[#dbc19f]/40 relative overflow-hidden">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 relative z-10">
            {currentStats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center p-10 md:p-16"
              >
                {/* İkon Kutusu: Beyaz, belirgin ve jilet gibi */}
                <div className="w-16 h-16 mb-8 rounded-2xl bg-white flex items-center justify-center text-[#dbc19f] shadow-sm border border-[#dbc19f]/20">
                  <stat.icon size={28} strokeWidth={1.5} />
                </div>

                {/* Sayılar: Siyah, Bold, Italic ve Dev Boyut (Net Görünürlük) */}
                <div className="text-4xl md:text-6xl font-black text-[#1A1A1A] mb-3 tracking-tighter italic leading-none">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Alt Yazı: Koyu Gri ve Aralıklı (Kurumsal) */}
                <p className="text-[10px] md:text-xs font-black text-[#4A4A4A] uppercase tracking-[0.4em] mb-8">
                  {stat.label}
                </p>

                {/* Sabit Vizon Çizgi */}
                <div className="w-12 h-[2px] bg-[#dbc19f] rounded-full" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}