"use client";

import { motion } from "framer-motion";

const partners = [
  { id: 1, name: "CRYSTAL HOTEL", src: "/partners/crystal-hotels.png", url: "https://www.crystalhotels.com.tr" },
  { id: 2, name: "Jolly", src: "/partners/jolly.png", url: "https://www.jollytur.com" },
  { id: 3, name: "NİRVANA HOTEL", src: "/partners/nirvana-hotels.png", url: "https://www.nirvanahotels.com.tr" },
  { id: 4, name: "MEKSİKA TÜRK ELÇİLİĞİ", src: "/partners/meksika-elciligi.png", url: "https://meksika-be.mfa.gov.tr/Mission" },
  { id: 5, name: "KRİSTAL ENDÜSTRİYEL", src: "/partners/kristal-endustriyel.png", url: "https://www.crystal.com.tr/" },
];

export default function Partners() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark border-t border-cream overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        
        <p className="text-center text-[10px] md:text-xs font-black text-luxury-gray/70 uppercase tracking-[0.4em] mb-10 md:mb-14">
          Kurumsal İş Ortaklarımız & Referanslarımız
        </p>

        {/* ✅ Aralıklar daraltıldı (gap-4 md:gap-6) ki yan yana daha çok kutu sığsın */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: partner.id * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <a 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer"
                title={`${partner.name} Web Sitesine Git`}
                /* ✅ KUTU BOYUTLARI KÜÇÜLTÜLDÜ: 
                   - w-32 h-20 (Mobil için çok zarif boyutlar)
                   - md:w-40 md:h-24 (Tablet/PC için ideal)
                   - padding değerleri px-4 py-3 olarak kısıldı 
                */
                className="group relative flex items-center justify-center px-4 py-3 md:px-6 md:py-4 bg-white rounded-3xl border border-white shadow-sm hover:shadow-[0_15px_30px_rgba(191,149,63,0.12)] hover:border-gold/20 hover:-translate-y-1.5 transition-all duration-500 outline-none w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28"
              >
                <img 
                  src={partner.src} 
                  alt={partner.name} 
                  className="max-h-full max-w-full object-contain grayscale opacity-60 transition-all duration-500 mix-blend-multiply group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                />
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}