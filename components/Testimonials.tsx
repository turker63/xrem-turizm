"use client";

import { motion } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { Star, Quote } from "lucide-react";

const reviewsData = {
  tr: [
    { name: "Ahmet Y.", type: "İş Seyahati", comment: "Antalya havalimanından otelime kadar kusursuz bir deneyimdi. Şoför tam vaktinde oradaydı, araç tertemiz ve yeniydi.", rating: 5 },
    { name: "Elena S.", type: "Tatil", comment: "Antalya'daki en iyi VIP transfer. Çok profesyonel şoför, lüks araç ve tam zamanında. Kesinlikle tavsiye ederim!", rating: 5 },
    { name: "Mehmet K.", type: "Aile Seyahati", comment: "Bebek koltuğu talebimizi eksiksiz yerine getirdiler. Ailemle çok güvenli, konforlu ve huzurlu bir yolculuk yaptık.", rating: 5 }
  ],
  en: [
    { name: "Ahmet Y.", type: "Business Trip", comment: "A flawless experience from Antalya airport to my hotel. The driver was right on time, and the car was spotless and new.", rating: 5 },
    { name: "Elena S.", type: "Holiday", comment: "The best VIP transfer in Antalya. Very professional driver, luxurious car, and highly punctual. Highly recommended!", rating: 5 },
    { name: "Mehmet K.", type: "Family Trip", comment: "They fulfilled our baby seat request perfectly. We had a very safe, comfortable, and peaceful journey with my family.", rating: 5 }
  ]
};

export default function Testimonials() {
  const { lang } = useLanguage();
  const currentReviews = lang === 'en' ? reviewsData.en : reviewsData.tr;

  const title1 = lang === 'en' ? "CUSTOMER" : "MÜŞTERİ";
  const title2 = lang === 'en' ? "REVIEWS" : "YORUMLARI";
  const ratingText = lang === 'en' ? "5.0 Excellent Service Rating" : "5.0 Mükemmel Hizmet Puanı";

  return (
    <section id="reviews" className="py-12 md:py-20 relative z-10 w-full scroll-mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* BAŞLIK ALANI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A] italic">
            {title1} <span className="text-[#dbc19f]">{title2}</span>
          </h3>
          
          <div className="flex items-center justify-center gap-2 mt-6 bg-[#FAF7F2] border border-[#dbc19f]/20 inline-flex px-6 py-3 rounded-full shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="text-[#dbc19f]" />
              ))}
            </div>
            <span className="text-[#1A1A1A] text-[10px] md:text-xs font-black tracking-[0.2em] uppercase ml-2 border-l border-[#dbc19f]/30 pl-4">
              {ratingText}
            </span>
          </div>
        </motion.div>

        {/* YORUM KARTLARI */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {currentReviews.map((r, i) => (
            <motion.div 
              key={i} 
              variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="bg-[#FAF7F2] border border-[#dbc19f]/30 p-8 md:p-10 rounded-[2.5rem] shadow-sm relative group flex flex-col h-full overflow-hidden"
            >
              <Quote 
                size={80} 
                className="absolute -top-2 -right-2 text-[#dbc19f]/10 rotate-12" 
                strokeWidth={1}
              />

              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(r.rating)].map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" className="text-[#dbc19f]" />
                ))}
              </div>

              <p className="text-[#1A1A1A] font-bold italic leading-relaxed mb-8 relative z-10 flex-grow text-sm">
                "{r.comment}"
              </p>

              <div className="relative z-10 pt-6 border-t border-[#dbc19f]/20">
                <div className="font-black text-[#1A1A1A] uppercase tracking-widest text-sm mb-1">
                  {r.name}
                </div>
                <div className="text-[10px] text-[#dbc19f] font-black uppercase tracking-[0.2em]">
                  {r.type}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}