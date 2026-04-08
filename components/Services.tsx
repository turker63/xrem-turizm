"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plane, Clock, Map, Star, ChevronRight, Briefcase, Ship, } from "lucide-react";

export default function Services() {
  const services = [
    { 
      title: "Şoförlü Araç Kiralama", 
      desc: "Günlük veya saatlik tahsis edilen şoförlü lüks araçlarla prestijli ulaşım.", 
      icon: <Clock size={18} />,
      slug: "soforlu-arac-kiralama",
      image: "/hizmetler/soforlu-arac-kiralama.jpeg"
    },
    { 
      title: "Vip Transfer", 
      desc: "Özel tasarlanmış VIP araçlarımızla ayrıcalıklı seyahat deneyimi.", 
      icon: <Star size={18} />,
      slug: "vip-transfer",
      image: "/hizmetler/vip-transfer.jpeg"
    },
    { 
      title: "Kongre ve Fuar", 
      desc: "Kurumsal etkinlikleriniz için profesyonel ulaşım çözümleri.", 
      icon: <Briefcase size={18} />,
      slug: "kongre-fuar-tasimaciligi",
      image: "/hizmetler/kongre-fuar-tasimaciligi.jpg"
    },
    { 
      title: "Özel Tur Taşıma", 
      desc: "Tarihi ve turistik lokasyonlara size özel hazırlanan güvenli gezi.", 
      icon: <Map size={18} />,
      slug: "ozel-tur-tasima",
      image: "/hizmetler/tur-tasima.jpeg"
    },
    { 
      title: "Havalimanı Vip Transfer", 
      desc: "Havalimanında isme özel karşılama ve sarsıntısız lüks transfer.", 
      icon: <Plane size={18} />,
      slug: "antalya-havalimani-vip-transfer",
      image: "/hizmetler/havalimani-transfer.jpg"
    },
    { 
      title: "VIP Yat Kiralama", 
      desc: "VIP özel Yatımız ile premium tatil deneyimi", 
      icon: <Ship size={18} />,
      slug: "vip-yat-kiralama",
      image: "/xrem-aqua.jpg"
    },
  ];

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
          <span className="text-[9px] font-black text-gold tracking-[0.4em] uppercase mb-3 block italic">HİZMETTE SINIR TANIMIYORUZ!</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-none mb-5">
             <span className="text-gold">HİZMETLERİMİZ</span>
          </h2>
          <div className="h-1 w-20 bg-gold mx-auto rounded-full shadow-lg shadow-gold/20" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-5">
          {services.map((service, index) => (
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
                  {service.icon}
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
                    İNCELE <ChevronRight size={12} />
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