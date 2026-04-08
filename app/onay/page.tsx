"use client";

import { Suspense, useState } from "react"; 
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, Check, Ticket, ChevronRight, Home, Smartphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';

function OnayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pnr = searchParams.get("pnr");
  const [copied, setCopied] = useState(false); 
  const { lang } = useLanguage();

  const tStrings = {
    title1: lang === 'en' ? "PAYMENT" : "ÖDEME",
    title2: lang === 'en' ? "CONFIRMED." : "ONAYLANDI.",
    subtitle1: lang === 'en' ? "CONGRATULATIONS! YOUR BOOKING HAS BEEN CREATED." : "TEBRİKLER! REZERVASYONUNUZ OLUŞTURULDU.",
    subtitle2: lang === 'en' ? "YOUR PRIVATE VEHICLE AND DRIVER ARE BEING PREPARED." : "SİZE ÖZEL ARACINIZ VE ŞOFÖRÜNÜZ HAZIRLANIYOR.",
    pnrLabel: lang === 'en' ? "YOUR BOOKING CODE" : "REZERVASYON KODUNUZ",
    notice: lang === 'en' ? "WE RECOMMEND KEEPING YOUR PNR CODE CONFIDENTIAL THROUGHOUT YOUR JOURNEY." : "PNR KODUNUZU SEYAHATİNİZ BOYUNCA SAKLI TUTMANIZI ÖNERİYORUZ.",
    btnTicket: lang === 'en' ? "VIEW TICKET" : "BİLETİ GÖRÜNTÜLE",
    btnHome: lang === 'en' ? "RETURN TO HOME" : "ANA SAYFAYA DÖN",
    loadingMsg: lang === 'en' ? "Sealing System..." : "Sistem Mühürleniyor..."
  };

  const copyToClipboard = () => {
    if (pnr) {
      navigator.clipboard.writeText(pnr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }} 
        animate={{ scale: 1, rotate: 0 }} 
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-2xl relative"
      >
        <CheckCircle2 size={56} className="text-emerald-500" />
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="absolute inset-0 rounded-full border-2 border-gold animate-ping opacity-20" 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-[#1a1a1a]">
          {tStrings.title1} <span className="text-gold">{tStrings.title2}</span>
        </h1>
        <div className="h-1.5 w-24 bg-gold mx-auto mb-8 rounded-full" />
        <p className="text-gray-600 text-[11px] md:text-sm tracking-[0.4em] uppercase mb-12 font-bold opacity-80 leading-relaxed">
          {tStrings.subtitle1} <br/>
          {tStrings.subtitle2}
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-gray-100 p-8 md:p-14 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] mb-12 relative overflow-hidden group max-w-xl mx-auto"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gold"></div>
        
        <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-2 rounded-full border border-gray-100 shadow-inner">
                <Ticket size={16} className="text-gold" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{tStrings.pnrLabel}</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 shadow-inner w-full">
                    <span className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#1a1a1a] font-mono">
                        {pnr || "XREM-VIP"}
                    </span>
                </div>
                
                <button 
                    onClick={copyToClipboard}
                    className="w-full md:w-auto bg-[#1a1a1a] text-white p-6 rounded-3xl hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95 group/copy flex items-center justify-center min-w-[80px]"
                >
                    <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={28} className="text-emerald-400" />
                        </motion.div>
                    ) : (
                        <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Copy size={28} className="group-hover/copy:scale-110 transition-transform" />
                        </motion.div>
                    )}
                    </AnimatePresence>
                </button>
            </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-50">
           <div className="flex items-center justify-center gap-2 text-gray-400">
              <Smartphone size={14} />
              <span className="text-[10px] uppercase font-black tracking-widest">{tStrings.notice}</span>
           </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center px-4">
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/sorgula?pnr=${pnr}`)}
          className="w-full md:w-auto bg-gold text-white px-12 py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group/btn"
        >
          <span className="relative z-10 flex items-center gap-3">{tStrings.btnTicket} <ChevronRight size={18} /></span>
          <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.7 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] z-5" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="w-full md:w-auto text-gray-600 bg-white border border-gray-200 px-12 py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <Home size={18} /> {tStrings.btnHome}
        </motion.button>
      </div>
    </div>
  );
}

export default function OnayPage() {
  const { lang } = useLanguage();
  const loadingMsg = lang === 'en' ? "Sealing System..." : "Sistem Mühürleniyor...";

  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95 backdrop-blur-[1px]" />
      </div>

      <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-4 relative min-h-screen flex items-center justify-center">
        <Suspense fallback={
          <div className="text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-gold rounded-full animate-spin shadow-2xl"></div>
            <span className="text-gold font-black uppercase tracking-[0.5em] text-[11px]">{loadingMsg}</span>
          </div>
        }>
          <OnayContent />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}