"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { Users, Car, MapPin, Star } from "lucide-react";

const statsData = {
  tr: [
    { id: 1, label: "Mutlu Müşteri", value: 15000, suffix: "+", icon: Users },
    { id: 2, label: "Yıllık Transfer", value: 8500, suffix: "+", icon: Car },
    { id: 3, label: "Desteklenen Rota", value: 120, suffix: "+", icon: MapPin },
    { id: 4, label: "Müşteri Puanı", value: 4.9, suffix: "/5", icon: Star },
  ],
  en: [
    { id: 1, label: "Happy Clients", value: 15000, suffix: "+", icon: Users },
    { id: 2, label: "Annual Transfers", value: 8500, suffix: "+", icon: Car },
    { id: 3, label: "Supported Routes", value: 120, suffix: "+", icon: MapPin },
    { id: 4, label: "Customer Rating", value: 4.9, suffix: "/5", icon: Star },
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
    <section className="py-20 bg-cream-dark border-y border-cream overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,149,63,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {currentStats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.id * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mb-6 bg-cream rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-gold shadow-sm border border-cream-dark group-hover:bg-gold group-hover:text-white transition-all duration-500 group-hover:shadow-[0_15px_30px_rgba(191,149,63,0.25)] group-hover:-translate-y-1">
                <stat.icon size={32} strokeWidth={1.5} />
              </div>

              <div className="text-3xl md:text-5xl font-black text-luxury-dark mb-2 tracking-tighter">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>

              <p className="text-[10px] md:text-xs font-black text-luxury-gray/70 uppercase tracking-[0.3em]">
                {stat.label}
              </p>
              
              <div className="w-8 h-1 bg-cream-dark mt-5 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-gold group-hover:w-full transition-all duration-700"></div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}