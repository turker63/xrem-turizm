"use client";

import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Hızlı Rezervasyon",
    description: "Sistemimizden rotanızı, tarihinizi ve aracınızı saniyeler içinde seçip güvenle onaylayın.",
    image: "/how-it-works/hizli-rezervasyon.jpeg", 
  },
  {
    id: 2,
    title: "VIP Karşılama",
    description: "Uçuşunuzu takip eden şoförümüz, havalimanı çıkışında sizi isminize özel tabelayla bekler.",
    image: "/how-it-works/karsilama.jpg",
  },
  {
    id: 3,
    title: "Premium Yolculuk",
    description: "Lüks donanımlı araçlarımız ve ikramlarımız eşliğinde gideceğiniz yere konforla ulaşın.",
    image: "/how-it-works/yolculuk.jpg",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-cream-dark border-y border-cream overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-20 md:mb-24">
          <p className="text-[10px] md:text-xs font-black text-luxury-gray/60 uppercase tracking-[0.4em] mb-4">
            SÜREÇ NASIL İŞLER?
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-luxury-dark uppercase tracking-tighter">
            3 Basit Adımda <span className="text-gold">Kusursuz Transfer</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-12 relative z-10">
          
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-[2px] pointer-events-none -z-10">
            <svg width="100%" height="20" className="overflow-visible">
              <path 
                d="M 0 10 Q 250 10 500 10 T 1000 10" 
                fill="none" 
                stroke="#bf953f" 
                strokeWidth="2" 
                strokeDasharray="8,8" 
                className="opacity-30"
              />
              <circle cx="33%" cy="10" r="4" fill="#bf953f" className="opacity-40" />
              <circle cx="66%" cy="10" r="4" fill="#bf953f" className="opacity-40" />
            </svg>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`flex flex-col items-center text-center group ${index % 2 === 1 ? "md:-translate-y-12" : ""}`}
            >
              <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mb-8 bg-cream rounded-full flex items-center justify-center border border-cream-dark shadow-sm group-hover:border-gold group-hover:shadow-[0_30px_60px_rgba(191,149,63,0.15)] transition-all duration-700 relative overflow-hidden">
                
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-full group-hover:scale-110 transition-all duration-700 pointer-events-none"
                />

                <div className="absolute inset-0 bg-gold/5 rounded-full" />

                <div className="absolute -top-2 -right-2 w-10 h-10 bg-luxury-dark text-gold rounded-full flex items-center justify-center font-black text-xs border-2 border-cream shadow-lg group-hover:scale-110 transition-transform z-20">
                  0{step.id}
                </div>
                
                <div className="absolute inset-0 bg-gold/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <h4 className="text-[11px] md:text-xs font-black text-luxury-dark uppercase tracking-[0.3em] mb-4 group-hover:text-gold transition-colors duration-500">
                {step.title}
              </h4>
              <p className="text-luxury-gray text-[9px] md:text-[10px] font-bold leading-relaxed tracking-wide max-w-[200px] md:max-w-[240px] opacity-80 group-hover:opacity-100 transition-opacity">
                {step.description}
              </p>

              <div className="w-8 h-1 bg-cream-dark mt-6 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-gold group-hover:w-full transition-all duration-700"></div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}