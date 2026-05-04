"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function ServicesPage() {
  const { lang } = useLanguage();

  const tStrings = {
    tagline: lang === 'en' ? "NO LIMITS IN SERVICE!" : "HİZMETTE SINIR TANIMIYORUZ!",
    title1: lang === 'en' ? "OUR VIP" : "VIP",
    title2: lang === 'en' ? "SERVICES" : "HİZMETLERİMİZ",
    detailsBtn: lang === 'en' ? "DISCOVER" : "KEŞFET",
    boutiqueTitle1: lang === 'en' ? "PERSONALIZED" : "KİŞİYE ÖZEL",
    boutiqueTitle2: lang === 'en' ? "BOUTIQUE TRANSFER" : "BUTİK TRANSFER",
    boutiqueDesc: lang === 'en' 
      ? "A travel experience beyond standards, planned with details exclusive to you." 
      : "Size özel detaylarla planlanmış, standartların ötesinde bir yolculuk deneyimi.",
    getQuote: lang === 'en' ? "GET A QUOTE" : "TEKLİF ALIN"
  };

  const servicesData = {
    tr: [
      { title: "Şoförlü Araç Kiralama", desc: "Günlük veya saatlik tahsis edilen şoförlü lüks araçlarla şehir içi ve dışı prestijli ulaşım.", slug: "soforlu-arac-kiralama", image: "/hizmetler/soforlu-arac-kiralama.jpeg", subText: "ŞEHİRİÇİ & ŞEHİRLERARASI" },
      { title: "Vip Transfer", desc: "Size özel tasarlanmış VIP araçlarımızla her lokasyona ayrıcalıklı ve konforlu seyahat deneyimi.", slug: "vip-transfer", image: "/hizmetler/vip-transfer.jpeg", subText: "LÜKS DOKUNUŞ" },
      { title: "Kongre Taşıma", desc: "Kurumsal etkinlikleriniz için profesyonel, zamanında ve kusursuz planlanmış ulaşım çözümleri.", slug: "kongre-fuar-tasimaciligi", image: "/hizmetler/kongre-fuar-tasimaciligi.jpg", subText: "KURUMSAL ÇÖZÜMLER" },
      { title: "Özel Tur", desc: "Bölgenin tarihi ve turistik lokasyonlarına, size özel hazırlanan rotalarla güvenli gezi.", slug: "ozel-tur-tasima", image: "/hizmetler/tur-tasima.jpeg", subText: "KEŞFE ÇIKIN" }
    ],
    en: [
      { title: "Chauffeured Car", desc: "Prestigious urban and intercity transportation with daily or hourly allocated luxury vehicles.", slug: "soforlu-arac-kiralama", image: "/hizmetler/soforlu-arac-kiralama.jpeg", subText: "CITY & INTERCITY" },
      { title: "VIP Transfer", desc: "Privileged and comfortable travel experience to any location with our custom VIP vehicles.", slug: "vip-transfer", image: "/hizmetler/vip-transfer.jpeg", subText: "LUXURY TOUCH" },
      { title: "Congress Transport", desc: "Professional, timely, and flawlessly planned transportation solutions for your corporate events.", slug: "kongre-fuar-tasimaciligi", image: "/hizmetler/kongre-fuar-tasimaciligi.jpg", subText: "CORPORATE SOLUTIONS" },
      { title: "Private Tour", desc: "Safe trips to the historical and tourist locations of the region with routes prepared for you.", slug: "ozel-tur-tasima", image: "/hizmetler/tur-tasima.jpeg", subText: "START EXPLORING" }
    ]
  };

  const currentServices = lang === 'en' ? servicesData.en : servicesData.tr;

  return (
    <main className="min-h-screen bg-cream-dark flex flex-col relative overflow-x-hidden">
      <Navbar />

      <section className="pt-44 pb-10 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.5em] uppercase mb-4 block">{tStrings.tagline}</span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2C2C2C] italic leading-none mb-6">
              {tStrings.title1} <span className="text-[#D4AF37]">{tStrings.title2}</span>
            </h1>
          </motion.div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-100 bg-white shadow-xl">
            {currentServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col group relative bg-white ${index !== currentServices.length - 1 ? 'border-b md:border-b-0 md:border-r border-gray-100' : ''}`}
              >
                <div className="w-full h-[300px] lg:h-[450px] overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                <div className="p-8 flex flex-col items-center text-center flex-1 bg-white relative z-10">
                  <span className="text-[8px] text-gray-400 font-bold tracking-[0.3em] uppercase mb-2">
                    {service.subText}
                  </span>
                  
                  <h3 className="text-[#2C2C2C] font-black text-lg md:text-xl uppercase tracking-widest mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-500 text-[11px] leading-loose font-medium mb-8 flex-1 px-2">
                    {service.desc}
                  </p>
                  
                  <Link 
                    href={`/hizmetler/${service.slug}`}
                    className="border-2 border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white px-8 py-3 text-[10px] font-black tracking-widest uppercase transition-all duration-300 mt-auto"
                  >
                    {tStrings.detailsBtn}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOUTIQUE TRANSFER BÖLÜMÜ (O ferah krem tonuyla) */}
      <section className="py-24 relative z-10 bg-cream-dark">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden border border-gray-100"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 text-[#D4AF37] mb-4">
                <ShieldCheck size={20} />
                <span className="font-black text-[10px] uppercase tracking-[0.3em]">Premium Experience</span>
              </div>
              <h4 className="text-3xl md:text-4xl font-black text-[#2C2C2C] uppercase tracking-tighter italic mb-4 leading-tight">
                {tStrings.boutiqueTitle1} <br /> <span className="text-[#D4AF37]">{tStrings.boutiqueTitle2}</span>
              </h4>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest max-w-sm leading-relaxed">
                {tStrings.boutiqueDesc}
              </p>
            </div>

            <Link 
              href="/iletisim"
              className="bg-[#2C2C2C] hover:bg-[#D4AF37] text-white px-10 py-5 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-md active:scale-95 whitespace-nowrap relative z-10 flex items-center gap-3"
            >
              {tStrings.getQuote} <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}