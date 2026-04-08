"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, FileText, Headphones, MessageCircle } from "lucide-react";

export default function SSSPage() {
  const { lang } = useLanguage();

  const tStrings = {
    supportCenter: lang === 'en' ? "Support Center" : "Destek Merkezi",
    title1: lang === 'en' ? "FREQUENTLY ASKED" : "SIKÇA SORULAN",
    title2: lang === 'en' ? "QUESTIONS" : "SORULAR",
    faqTitle: lang === 'en' ? "Curious Things" : "Merak Edilenler",
    faqDesc: lang === 'en' ? "Detailed information about our services" : "Hizmetlerimiz hakkında detaylı bilgiler",
    docsTitle: lang === 'en' ? "Corporate Documents" : "Kurumsal Belgeler",
    liveSupport: lang === 'en' ? "24/7 Live Support" : "7/24 Canlı Destek",
    contactTitle: lang === 'en' ? "Couldn't find your answer?" : "Cevabınızı bulamadınız mı?",
    contactDesc: lang === 'en' ? "We are just a WhatsApp message away." : "Size bir WhatsApp uzağındayız.",
    whatsappBtn: lang === 'en' ? "WhatsApp Line" : "WhatsApp Hattı",
  };

  const corporateLinks = [
    { name: lang === 'en' ? "About Us" : "Hakkımızda", href: "/hakkimizda" },
    { name: lang === 'en' ? "Bank Accounts" : "Banka Hesapları", href: "/banka-hesaplari" },
    { name: lang === 'en' ? "Passenger Transport" : "Yolcu Taşıma", href: "/yolcu-tasima" },
    { name: lang === 'en' ? "Security & Privacy Policy" : "Güvenlik ve Gizlilik Sözleşmesi", href: "/gizlilik" },
    { name: lang === 'en' ? "Cancellation & Refund" : "İptal ve İade Koşulları", href: "/iptal-iade" },
    { name: lang === 'en' ? "KVKK Clarification Text" : "Kişisel Verilerin Korunması Kanunu", href: "/kvkk" },
  ];

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      
      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/80 to-cream/85 backdrop-blur-[1px]" />
      </div>

      <section className="pt-44 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block">{tStrings.supportCenter}</span>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-none mb-6">
              {tStrings.title1} <br /> <span className="text-gold">{tStrings.title2}</span>
            </h1>
            <div className="h-1.5 w-24 bg-gold rounded-full" />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-8">
            <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white shadow-xl">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Headphones size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a]">{tStrings.faqTitle}</h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{tStrings.faqDesc}</p>
                </div>
              </div>
              <FAQ />
            </div>
          </div>

          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 border-b border-cream-dark pb-6">
                <FileText className="text-gold" size={20} />
                <h4 className="text-[#1a1a1a] font-black text-[12px] uppercase tracking-widest">
                  {tStrings.docsTitle}
                </h4>
              </div>
              
              <nav className="flex flex-col space-y-3">
                {corporateLinks.map((link, idx) => (
                  <Link 
                    key={idx} 
                    href={link.href}
                    className="flex justify-between items-center p-4 rounded-2xl bg-cream/50 hover:bg-gold transition-all border border-cream-dark hover:border-gold group/item shadow-sm"
                  >
                    <span className="text-[11px] font-black text-gray-600 group-hover/item:text-white transition-colors uppercase tracking-tight">
                      {link.name}
                    </span>
                    <ArrowRight className="text-gold group-hover/item:text-white transition-all" size={16} />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="bg-gold p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <span className="bg-white/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">{tStrings.liveSupport}</span>
                <h4 className="text-2xl font-black mb-4 leading-tight italic uppercase tracking-tighter">{tStrings.contactTitle}</h4>
                <p className="text-[11px] font-bold opacity-90 mb-8 uppercase tracking-widest">{tStrings.contactDesc}</p>
                <a 
                  href="https://wa.me/905322855572" 
                  className="bg-[#1a1a1a] text-white w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase hover:bg-white hover:text-gold transition-all tracking-[0.2em] shadow-2xl active:scale-95"
                >
                  <MessageCircle size={18} /> {tStrings.whatsappBtn}
                </a>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10 text-8xl font-black italic select-none group-hover:scale-110 transition-transform duration-700">VIP</div>
            </div>
          </motion.aside>

        </div>
      </section>

      <Footer />
    </main>
  );
}