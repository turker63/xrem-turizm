"use client";

import { motion } from "framer-motion";
import { Wrench, Timer, ShieldCheck, Instagram, MessageCircle } from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Dekoratif Işıklar */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Logo */}
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
            XREM<span className="text-gold">TRANSFER</span>
          </h1>

          {/* Animasyonlu İkonlar */}
          <div className="flex justify-center gap-6 text-gold/50">
             <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 3 }}><Wrench size={40} /></motion.div>
             <ShieldCheck size={40} className="text-gold" />
             <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Timer size={40} /></motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-[0.2em]">SİSTEM GÜNCELLEMESİ</h2>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] leading-relaxed italic max-w-md mx-auto">
              Sizlere daha kusursuz bir VIP deneyimi sunabilmek için garajdayız. <br /> 
              Çok yakında en yüksek konforla yollardayız.
            </p>
          </div>

          {/* İletişim Butonları (Bakımdayken bile ulaşılabilir ol) */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <a href="https://wa.me/905322855572" target="_blank" className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all">
              <MessageCircle size={16} /> WHATSAPP DESTEK
            </a>
          </div>

          <p className="pt-16 text-[8px] font-black text-gray-800 uppercase tracking-[0.6em]">
            © 2026 XREM PREMIUM LOGISTICS HUB
          </p>
        </motion.div>
      </div>
    </main>
  );
}