"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';

const servicesData = {
  tr: [
    { title: "Şoförlü Araç", desc: "Günlük veya saatlik tahsis edilen lüks araçlarla prestijli ulaşım.", slug: "soforlu-arac-kiralama", image: "/hizmetler/soforlu-arac-kiralama.jpeg", subText: "ŞEHİRİÇİ & ŞEHİRLERARASI" },
    { title: "Vip Transfer", desc: "VIP araçlarımızla her lokasyona ayrıcalıklı seyahat deneyimi.", slug: "vip-transfer", image: "/hizmetler/vip-transfer.jpeg", subText: "LÜKS DOKUNUŞ" },
    { title: "Kongre Taşıma", desc: "Kurumsal etkinlikleriniz için profesyonel ve kusursuz çözümler.", slug: "kongre-fuar-tasimaciligi", image: "/hizmetler/kongre-fuar-tasimaciligi.jpg", subText: "KURUMSAL ÇÖZÜMLER" },
    { title: "Özel Tur", desc: "Bölgenin turistik lokasyonlarına, size özel rotalarla güvenli gezi.", slug: "ozel-tur-tasima", image: "/hizmetler/tur-tasima.jpeg", subText: "KEŞFE ÇIKIN" },
    { title: "Havalimanı VIP", desc: "Havalimanında VIP karşılama ve otelinize kadar sarsıntısız transfer.", slug: "antalya-havalimani-vip-transfer", image: "/hizmetler/havalimani-transfer.jpg", subText: "KESİNTİSİZ KONFOR" },
    { title: "Yat Kiralama", desc: "Özel Yatımız ile premium tatil ve deniz üstünde benzersiz bir deneyim.", slug: "vip-yat-kiralama", image: "/xrem-aqua.jpg", subText: "MAVİ YOLCULUK" },
  ],
  en: [
    { title: "Chauffeured Car", desc: "Prestigious transportation with daily or hourly luxury vehicles.", slug: "soforlu-arac-kiralama", image: "/hizmetler/soforlu-arac-kiralama.jpeg", subText: "CITY & INTERCITY" },
    { title: "VIP Transfer", desc: "Privileged travel experience to any location with our VIP vehicles.", slug: "vip-transfer", image: "/hizmetler/vip-transfer.jpeg", subText: "LUXURY TOUCH" },
    { title: "Congress Transport", desc: "Professional and flawlessly planned solutions for corporate events.", slug: "kongre-fuar-tasimaciligi", image: "/hizmetler/kongre-fuar-tasimaciligi.jpg", subText: "CORPORATE SOLUTIONS" },
    { title: "Private Tour", desc: "Safe trips to tourist locations with routes prepared just for you.", slug: "ozel-tur-tasima", image: "/hizmetler/tur-tasima.jpeg", subText: "START EXPLORING" },
    { title: "Airport VIP", desc: "VIP welcome at the airport and a safe luxury transfer to your hotel.", slug: "antalya-havalimani-vip-transfer", image: "/hizmetler/havalimani-transfer.jpg", subText: "SEAMLESS COMFORT" },
    { title: "Yacht Charter", desc: "Premium holiday experience and an unparalleled journey on the sea.", slug: "vip-yat-kiralama", image: "/xrem-aqua.jpg", subText: "BLUE VOYAGE" },
  ]
};

export default function Services() {
  const { lang } = useLanguage();
  const currentServices = lang === 'en' ? servicesData.en : servicesData.tr;
  
  const title1 = lang === 'en' ? "OUR" : "VİP";
  const title2 = lang === 'en' ? "SERVICES" : "HİZMETLERİMİZ";
  const detailsBtn = lang === 'en' ? "DISCOVER" : "KEŞFET";

  return (
    <div className="w-full relative z-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#2C2C2C] italic">
            {title1} <span className="text-[#D4AF37]">{title2}</span>
          </h2>
        </motion.div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-gray-100 border border-gray-100 shadow-md">
          {currentServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col group relative bg-white"
            >
              {/* RESİM BOYUTLARI CİDDİ ŞEKİLDE KÜÇÜLTÜLDÜ (h-220px) */}
              <div className="w-full h-[220px] lg:h-[260px] overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              {/* İÇ BOŞLUKLAR (PADDING) KISILDI */}
              <div className="p-5 md:p-6 flex flex-col items-center text-center flex-1 relative z-10">
                <span className="text-[8px] text-gray-400 font-bold tracking-[0.3em] uppercase mb-2">
                  {service.subText}
                </span>
                
                <h3 className="text-[#2C2C2C] font-black text-base md:text-lg uppercase tracking-widest mb-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-500 text-[10px] leading-relaxed font-medium mb-5 flex-1 px-2 line-clamp-2">
                  {service.desc}
                </p>
                
                <Link 
                  href={`/hizmetler/${service.slug}`}
                  className="border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white px-6 py-2.5 text-[9px] font-black tracking-widest uppercase transition-all duration-300 mt-auto"
                >
                  {detailsBtn}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}