"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { 
    name: "Ahmet Y.", 
    type: "İş Seyahati",
    comment: "Antalya havalimanından otelime kadar kusursuz bir deneyimdi. Şoför tam vaktinde oradaydı, araç tertemiz ve yeniydi.", 
    rating: 5 
  },
  { 
    name: "Elena S.", 
    type: "Tatil / Holiday",
    comment: "The best VIP transfer in Antalya. Very professional driver, luxurious car, and highly punctual. Highly recommended!", 
    rating: 5 
  },
  { 
    name: "Mehmet K.", 
    type: "Aile Seyahati",
    comment: "Bebek koltuğu talebimizi eksiksiz yerine getirdiler. Ailemle çok güvenli, konforlu ve huzurlu bir yolculuk yaptık.", 
    rating: 5 
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-cream-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-luxury-dark">
            MÜŞTERİ <span className="text-gold">YORUMLARI</span>
          </h3>
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" className="text-gold" />
            ))}
            <span className="text-luxury-gray text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ml-2">
              5.0 Mükemmel Hizmet Puanı
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((r, i) => (
            <motion.div 
              key={i} 
              variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="bg-cream p-8 md:p-12 border border-cream-dark rounded-[2.5rem] shadow-sm hover:shadow-[0_25px_50px_rgba(191,149,63,0.08)] hover:border-gold/20 hover:-translate-y-2 transition-all duration-500 relative group flex flex-col h-full overflow-hidden"
            >
              <Quote 
                size={80} 
                className="absolute top-8 right-8 text-cream-dark group-hover:text-gold/10 transition-colors duration-500 rotate-12" 
                strokeWidth={1}
              />

              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(r.rating)].map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" className="text-gold" />
                ))}
              </div>

              <p className="text-luxury-dark font-medium italic leading-relaxed mb-8 relative z-10 flex-grow text-sm md:text-base opacity-90 group-hover:opacity-100 transition-opacity">
                "{r.comment}"
              </p>

              <div className="relative z-10 border-t border-cream-dark pt-6">
                <div className="font-black text-luxury-dark uppercase tracking-widest text-sm mb-1 group-hover:text-gold transition-colors">
                  {r.name}
                </div>
                <div className="text-[10px] text-luxury-gray/70 font-bold uppercase tracking-[0.2em]">
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