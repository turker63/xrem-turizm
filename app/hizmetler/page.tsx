"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Plane, Clock, Map, Star, ShieldCheck, ChevronRight, Briefcase, Ship } from "lucide-react";

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = [
    { 
      title: "Şoförlü Araç Kiralama", 
      desc: "Günlük veya saatlik tahsis edilen şoförlü lüks araçlarla şehir içi ve dışı prestijli ulaşım.", 
      icon: <Clock size={20} />,
      slug: "soforlu-arac-kiralama",
      image: "/hizmetler/soforlu-arac-kiralama.jpeg"
    },
    { 
      title: "Vip Transfer", 
      desc: "Size özel tasarlanmış VIP araçlarımızla her lokasyona ayrıcalıklı ve konforlu seyahat deneyimi.", 
      icon: <Star size={20} />,
      slug: "vip-transfer",
      image: "/hizmetler/vip-transfer.jpeg"
    },
    { 
      title: "Kongre ve Fuar Taşımacılığı", 
      desc: "Kurumsal etkinlikleriniz için profesyonel, zamanında ve kusursuz planlanmış ulaşım çözümleri.", 
      icon: <Briefcase size={20} />,
      slug: "kongre-fuar-tasimaciligi",
      image: "/hizmetler/kongre-fuar-tasimaciligi.jpg"
    },
    { 
      title: "Özel Tur Taşıma", 
      desc: "Bölgenin tarihi ve turistik lokasyonlarına, size özel hazırlanan rotalarla güvenli gezi.", 
      icon: <Map size={20} />,
      slug: "ozel-tur-tasima",
      image: "/hizmetler/tur-tasima.jpeg"
    },
    { 
      title: "Antalya Havalimanı Vip Transfer", 
      desc: "Havalimanında isme özel VIP karşılama ve otelinize kadar sarsıntısız, güvenli lüks transfer.", 
      icon: <Plane size={20} />,
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
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img 
          src="/how-it-works/hizli-rezervasyon.jpeg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>

      <section className="pt-44 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block italic">HİZMETTE SINIR TANIMIYORUZ! </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-none mb-6">
              VIP <span className="text-gold">HİZMETLERİMİZ</span>
            </h1>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-lg shadow-gold/20" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] group bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white flex flex-col hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] hover:border-gold hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative w-full h-48 rounded-[2rem] overflow-hidden mb-6 bg-cream-dark">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md border border-white rounded-xl flex items-center justify-center text-gold shadow-lg group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                    {service.icon}
                  </div>
                </div>
                
                <div className="px-4 pb-4 space-y-4 flex flex-col flex-1 text-center">
                  <h3 className="text-[#1a1a1a] font-black text-lg uppercase tracking-tighter italic group-hover:text-gold transition-colors line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-[#1a1a1a] text-[10px] font-bold leading-relaxed uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
                    {service.desc}
                  </p>
                  
                  <div className="pt-4 mt-auto flex justify-center">
                    <Link 
                      href={`/hizmetler/${service.slug}`}
                      className="inline-flex items-center gap-2 text-gold font-black text-[9px] tracking-widest uppercase hover:text-[#1a1a1a] transition-colors bg-white/60 px-4 py-2 rounded-full border border-white/50 hover:border-gold/30 shadow-sm"
                    >
                      DETAYLARI İNCELE <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/40 backdrop-blur-md rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-white hover:border-gold hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <div className="relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 text-gold mb-4">
                <ShieldCheck size={20} />
                <span className="font-black text-[10px] uppercase tracking-[0.3em]">Premium Experience</span>
              </div>
              <h4 className="text-3xl md:text-4xl font-black text-[#1a1a1a] uppercase tracking-tighter italic mb-4 leading-tight">
                KİŞİYE ÖZEL <br /> <span className="text-gold">BUTİK TRANSFER</span>
              </h4>
              <p className="text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest max-w-sm opacity-80 leading-relaxed">
                Size özel detaylarla planlanmış, standartların ötesinde bir yolculuk deneyimi.
              </p>
            </div>

            <a 
              href="/iletisim"
              className="bg-[#1a1a1a] hover:bg-gold text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 whitespace-nowrap relative z-10 flex items-center gap-3"
            >
              TEKLİF ALIN <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}