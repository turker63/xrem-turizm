"use client";

import { motion } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { Headset, BadgeCheck, UserCheck, Sparkles } from "lucide-react";

const featuresData = {
  tr: [
    { title: "7/24 Destek", desc: "Hangi saatte isterseniz yanınızdayız." },
    { title: "Sabit Fiyat", desc: "Sürpriz ücret yok, şeffaf ücretlendirme." },
    { title: "Uzman Şoförler", desc: "Deneyimli ekibimizle güvenli yolculuk." },
    { title: "Lüks Filo", desc: "Yeni model VIP donanımlı araçlar." },
  ],
  en: [
    { title: "24/7 Support", desc: "We are with you at any time you need." },
    { title: "Fixed Price", desc: "No surprise fees, transparent pricing." },
    { title: "Expert Drivers", desc: "Safe journey with our experienced team." },
    { title: "Luxury Fleet", desc: "New model VIP equipped vehicles." },
  ]
};

const icons = [Headset, BadgeCheck, UserCheck, Sparkles];

export default function Features() {
  const { lang } = useLanguage();
  const currentFeatures = lang === 'en' ? featuresData.en : featuresData.tr;

  return (
    <section className="py-20 md:py-32 px-4 relative bg-cream-dark">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.2 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8"
      >
        {currentFeatures.map((f, i) => {
          const IconComponent = icons[i];
          return (
            <motion.div 
              key={i}
              variants={{ hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              whileHover={{ y: -10 }}
              className="group relative bg-cream border border-cream-dark p-8 md:p-10 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_50px_rgba(191,149,63,0.08)] hover:border-gold/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-20 h-20 mb-6 relative z-10 flex items-center justify-center bg-white rounded-2xl group-hover:bg-gold transition-all duration-500 shadow-sm border border-cream-dark group-hover:border-gold">
                <IconComponent size={36} strokeWidth={1.5} className="text-gold group-hover:text-white transition-colors duration-500" />
              </div>
              
              <h4 className="text-base md:text-lg font-black text-luxury-dark mb-3 uppercase tracking-widest relative z-10 group-hover:text-gold transition-colors">
                {f.title}
              </h4>
              <p className="text-luxury-gray text-xs md:text-sm font-bold relative z-10 transition-colors leading-relaxed opacity-80 group-hover:opacity-100">
                {f.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}