"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  // URL'den gelen PNR'ı yakala (XREM-XXXXX formatında)
  const pnr = searchParams.get("pnr") || "XREM-ERROR";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-gold/30">
      <Navbar />
      <section className="pt-40 pb-20 px-4 flex justify-center text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-xl w-full glass p-12 rounded-[3.5rem] border border-gold/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(212,175,55,0.05)]"
        >
          {/* ✅ BAŞARI İKONU */}
          <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
            <motion.span 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="text-black text-5xl font-bold"
            >
              ✓
            </motion.span>
          </div>

          <h2 className="text-gold text-3xl font-black uppercase tracking-widest mb-4 italic">ÖDEME BAŞARILI</h2>
          <p className="text-gray-400 text-[10px] mb-12 tracking-[0.4em] uppercase font-bold">TEBRİKLER! REZERVASYONUNUZ OLUŞTURULDU.</p>
          
          {/* 🎟️ VIP DİJİTAL BİLET KONTEYNERI */}
          <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group transition-all hover:border-gold/30">
             <div className="absolute top-0 right-0 p-6 opacity-5 text-5xl font-black italic uppercase select-none tracking-tighter">XREM VIP</div>
             
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] mb-6">REZERVASYON NUMARASI (PNR)</p>
             
             <div className="flex flex-col items-center justify-center gap-6">
                {/* PNR KODU: Büyük ve İtalik */}
                <p className="text-5xl md:text-6xl font-black tracking-[0.15em] text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {pnr}
                </p>
                
                {/* ✅ GELİŞMİŞ KOPYALA BUTONU */}
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-3 px-8 py-3 rounded-2xl border transition-all duration-500 ${
                    copied 
                    ? 'bg-green-500 border-green-500 text-white scale-105' 
                    : 'bg-white/5 border-white/10 text-gold hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  }`}
                >
                  {copied ? (
                    <span className="text-[10px] font-black uppercase tracking-widest">KOPYALANDI!</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      <span className="text-[10px] font-black uppercase tracking-widest">KODU KOPYALA</span>
                    </>
                  )}
                </button>
             </div>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-white/5 border border-white/10 text-white font-black py-6 rounded-[2rem] mt-12 hover:bg-white hover:text-black transition-all uppercase text-[11px] tracking-[0.4em] shadow-xl"
          >
            ANA SAYFAYA DÖN
          </button>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}