"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';
import { Plane, Clock, Map, Star, ChevronRight, Briefcase, Ship } from "lucide-react";

const servicesData = {
  tr: [
    { title: "Şoförlü Araç Kiralama", desc: "Günlük veya saatlik tahsis edilen şoförlü lüks araçlarla prestijli ulaşım.", slug: "soforlu-arac-kiralama", image: "/hizmetler/soforlu-arac-kiralama.jpeg" },
    { title: "Vip Transfer", desc: "Özel tasarlanmış VIP araçlarımızla ayrıcalıklı seyahat deneyimi.", slug: "vip-transfer", image: "/hizmetler/vip-transfer.jpeg" },
    { title: "Kongre ve Fuar", desc: "Kurumsal etkinlikleriniz için profesyonel ulaşım çözümleri.", slug: "kongre-fuar-tasimaciligi", image: "/hizmetler/kongre-fuar-tasimaciligi.jpg" },
    { title: "Özel Tur Taşıma", desc: "Tarihi ve turistik lokasyonlara size özel hazırlanan güvenli gezi.", slug: "ozel-tur-tasima", image: "/hizmetler/tur-tasima.jpeg" },
    { title: "Havalimanı Vip Transfer", desc: "Havalimanında isme özel karşılama ve sarsıntısız lüks transfer.", slug: "antalya-havalimani-vip-transfer", image: "/hizmetler/havalimani-transfer.jpg" },
    { title: "VIP Yat Kiralama", desc: "VIP özel Yatımız ile premium tatil deneyimi.", slug: "vip-yat-kiralama", image: "/xrem-aqua.jpg" },
  ],
  en: [
    { title: "Chauffeured Car Rental", desc: "Prestigious transportation with luxury vehicles allocated daily or hourly.", slug: "soforlu-arac-kiralama", image: "/hizmetler/soforlu-arac-kiralama.jpeg" },
    { title: "VIP Transfer", desc: "Privileged travel experience with our custom-designed VIP vehicles.", slug: "vip-transfer", image: "/hizmetler/vip-transfer.jpeg" },
    { title: "Congress & Fair", desc: "Professional transportation solutions for your corporate events.", slug: "kongre-fuar-tasimaciligi", image: "/hizmetler/kongre-fuar-tasimaciligi.jpg" },
    { title: "Private Tour Transport", desc: "Safe tours specially prepared for you to historical and tourist locations.", slug: "ozel-tur-tasima", image: "/hizmetler/tur-tasima.jpeg" },
    { title: "Airport VIP Transfer", desc: "Personalized welcome at the airport and a smooth luxury transfer.", slug: "antalya-havalimani-vip-transfer", image: "/hizmetler/havalimani-transfer.jpg" },
    { title: "VIP Yacht Charter", desc: "Premium holiday experience with our private VIP Yacht.", slug: "vip-yat-kiralama", image: "/xrem-aqua.jpg" },
  ]
};

const icons = [
  <Clock size={18} key="clock" />, 
  <Star size={18} key="star" />, 
  <Briefcase size={18} key="briefcase" />, 
  <Map size={18} key="map" />, 
  <Plane size={18} key="plane" />, 
  <Ship size={18} key="ship" />
];

export default function Services() {
  const { lang } = useLanguage();
  const currentServices = lang === 'en' ? servicesData.en : servicesData.tr;

  const subtitle = lang === 'en' ? 'NO LIMITS IN SERVICE!' : 'HİZMETTE SINIR TANIMIYORUZ!';
  const mainTitle = lang === 'en' ? 'OUR SERVICES' : 'HİZMETLERİMİZ';
  const btnText = lang === 'en' ? 'DETAILS' : 'İNCELE';

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-cream">
      <div className="absolute inset-0 z-0">
        <img 
          src="/bolgeler-bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/75 via-cream/60 to-cream/75 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[9px] font-black text-gold tracking-[0.4em] uppercase mb-3 block italic">{subtitle}</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-none mb-5">
             <span className="text-gold">{mainTitle}</span>
          </h2>
          <div className="h-1 w-20 bg-gold mx-auto rounded-full shadow-lg shadow-gold/20" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-5">
          {currentServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-[320px] group bg-white/40 backdrop-blur-xl p-3.5 rounded-[2.2rem] border border-white flex flex-col hover:shadow-[0_15px_40px_rgba(191,149,63,0.12)] hover:border-gold hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative w-full h-40 rounded-[1.8rem] overflow-hidden mb-5 bg-cream-dark shadow-lg">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md border border-white rounded-xl flex items-center justify-center text-gold shadow-xl group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  {icons[index]}
                </div>
              </div>
              
              <div className="px-3 pb-4 space-y-3 flex flex-col flex-1 text-center">
                <h3 className="text-[#1a1a1a] font-black text-base uppercase tracking-tighter italic group-hover:text-gold transition-colors line-clamp-1 leading-tight">
                  {service.title}
                </h3>
                <p className="text-[#1a1a1a] text-[10px] font-bold leading-relaxed uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                  {service.desc}
                </p>
                
                <div className="pt-2 mt-auto flex justify-center">
                  <Link 
                    href={`/hizmetler/${service.slug}`}
                    className="inline-flex items-center gap-2 text-gold font-black text-[8px] tracking-[0.2em] uppercase hover:text-[#1a1a1a] transition-all bg-white/80 px-5 py-2.5 rounded-full border border-white shadow-sm hover:border-gold"
                  >
                    {btnText} <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}