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
    <section className="py-8 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-gray-100">
            {currentFeatures.map((f, i) => {
              const IconComponent = icons[i];
              return (
                <motion.div 
                  key={i}
                  className="group relative bg-white p-8 md:p-12 flex flex-col items-center text-center transition-all duration-500 hover:bg-[#FAF9F5]"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#D4AF37] transition-colors duration-500" />
                  
                  <div className="w-16 h-16 mb-6 relative z-10 flex items-center justify-center bg-gray-50 rounded-full transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_10px_20px_rgba(212,175,55,0.15)]">
                    <IconComponent size={28} strokeWidth={1.5} className="text-[#2C2C2C] group-hover:text-[#D4AF37] transition-colors duration-500" />
                  </div>
                  
                  <h4 className="text-sm md:text-base font-black text-[#2C2C2C] mb-3 uppercase tracking-widest relative z-10">
                    {f.title}
                  </h4>
                  <p className="text-gray-500 text-xs font-medium relative z-10 leading-relaxed opacity-80 group-hover:opacity-100">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}