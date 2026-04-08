"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BANK_ACCOUNTS = [
  {
    bankName: "VAKIFBANK",
    accountHolder: "XREM TURİZM TAŞIMACILIK LTD. ŞTİ.",
    branch: "Xrem Turizm Taşımacılık Otomotiv Ticaret Limited Şirketi",
    accountNo: "-",
    iban: " TR26 0001 5001 5800 7309 9586 62",
    currency: "TRY"
  },
  {
    bankName: "İŞ BANKASI",
    accountHolder: "XREM TURİZM TAŞIMACILIK LTD. ŞTİ.",
    branch: "Xrem Turizm Taşımacılık Otomotiv Ticaret Limited Şirketi",
    accountNo: "-",
    iban: "TR02 0006 4000 0016 2290 1222 95",
    currency: "TRY"
  },
  {
    bankName: "GARANTİ BANKASI",
    accountHolder: "XREM TURİZM TAŞIMACILIK LTD. ŞTİ.",
    branch: "Xrem Turizm Taşımacılık Otomotiv Ticaret Limited Şirketi",
    accountNo: "-",
    iban: "TR92 0006 2001 3010 0006 2982 39",
    currency: "TRY"
  },
    {
    bankName: "AKBANK",
    accountHolder: "XREM TURİZM TAŞIMACILIK LTD. ŞTİ.",
    branch: "Xrem Turizm Taşımacılık Otomotiv Ticaret Limited Şirketi",
    accountNo: "-",
    iban: " TR84 0004 6007 1488 8000 2441 31",
    currency: "TRY"
  },
];

export default function BankaHesaplariPage() {
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

      <section className="relative pt-44 pb-12 overflow-hidden text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 relative z-10"
        >
          <span className="text-gold text-[10px] font-black tracking-[0.6em] uppercase mb-4 block italic">OFFICIAL ACCOUNTS</span>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-[#1a1a1a]">
            ÖDEME <span className="text-gold">KANALLARI</span>
          </h1>
          <p className="text-gray-500 text-[10px] tracking-[0.5em] uppercase font-black opacity-80">
            XREMTRANSFER | GÜVENLİ TRANSFER HATTI
          </p>
        </motion.div>
      </section>

      <section className="py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BANK_ACCOUNTS.map((bank, index) => (
              <BankCard key={index} bank={bank} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32 px-6 relative z-10">
        <div className="max-w-2xl mx-auto bg-white/60 border border-white p-8 rounded-[2rem] backdrop-blur-xl text-center shadow-2xl">
          <h2 className="text-gold text-[10px] font-black italic uppercase tracking-[0.3em] mb-4">Önemli Hatırlatma</h2>
          <p className="text-gray-600 text-xs italic leading-relaxed font-bold">
            Havale işlemlerinde açıklama kısmına <span className="text-[#1a1a1a] font-black uppercase underline decoration-gold/50 underline-offset-4">PNR Kodunuzu</span> eklemeyi unutmayınız. Transferiniz saniyeler içinde mühürlenecektir.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function BankCard({ bank, index }: { bank: any, index: number }) {
  const [copied, setCopied] = useState(false);

  const copyIban = () => {
    navigator.clipboard.writeText(bank.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/40 backdrop-blur-md border border-white p-6 rounded-[2rem] hover:border-gold hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] shadow-lg transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-[2px] bg-gold rounded-full" />
          <span className="text-[8px] font-black text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-full italic uppercase shadow-sm">
            {bank.currency}
          </span>
        </div>

        <h3 className="text-xl font-black italic uppercase mb-1 tracking-tighter text-[#1a1a1a]">{bank.bankName}</h3>
        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-6 opacity-80">{bank.branch}</p>

        <div className="space-y-4 mb-8">
          <div>
            <span className="text-[7px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">HESAP SAHİBİ</span>
            <span className="text-[11px] font-bold italic text-gray-700 leading-none">{bank.accountHolder}</span>
          </div>
          <div>
            <span className="text-[7px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">HESAP NO</span>
            <span className="text-[11px] font-mono font-bold text-gray-500">{bank.accountNo}</span>
          </div>
        </div>
      </div>

      <div className="relative cursor-pointer group/copy mt-auto" onClick={copyIban}>
        <div className="bg-white/60 border border-white/50 rounded-xl p-4 transition-all duration-300 group-hover/copy:border-gold group-hover/copy:bg-gold/5 group-hover/copy:shadow-[0_0_20px_rgba(191,149,63,0.15)] shadow-inner">
          <span className="text-[7px] text-gold font-black uppercase tracking-[0.2em] block mb-1">IBAN</span>
          <span className="text-[10px] font-mono font-bold tracking-tight text-[#1a1a1a] break-all">
            {bank.iban}
          </span>
          
          <div className="absolute top-4 right-4">
             <AnimatePresence mode="wait">
               {copied ? (
                 <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600 text-[10px] font-black">✓</motion.span>
               ) : (
                 <svg key="copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold opacity-60 group-hover/copy:opacity-100 transition-opacity">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                 </svg>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}