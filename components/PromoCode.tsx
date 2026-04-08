"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, CheckCircle2, XCircle } from "lucide-react";

interface PromoCodeProps {
  basePrice: number;
  onDiscountApplied: (discountAmount: number) => void;
}

export default function PromoCode({ basePrice, onDiscountApplied }: PromoCodeProps) {
  const [promoCode, setPromoCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const VALID_CODES: Record<string, number> = {
    "XREM10": 0.10, // %10
    "ZYNKA20": 0.20, // %20
    "ANTALYA50": 50,  // 50 TL sabit
  };

  const handleApplyCode = () => {
    setStatus("loading");
    setTimeout(() => {
      const code = promoCode.toUpperCase();
      if (VALID_CODES[code]) {
        const discountValue = VALID_CODES[code];
        const amount = discountValue < 1 ? basePrice * discountValue : discountValue;
        
        onDiscountApplied(amount); // Ana sayfaya indirimi saniyeler içinde bildir
        setStatus("success");
      } else {
        setStatus("error");
        onDiscountApplied(0);
      }
    }, 1000);
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl backdrop-blur-3xl w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => { setPromoCode(e.target.value); setStatus("idle"); }}
          placeholder="İNDİRİM KODU..."
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white flex-1 focus:border-gold/50 outline-none"
        />
        <button
          onClick={handleApplyCode}
          disabled={status === "loading" || status === "success"}
          className="bg-gold text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase italic hover:scale-105 transition-all disabled:opacity-50"
        >
          {status === "loading" ? "..." : "UYGULA"}
        </button>
      </div>
      <AnimatePresence>
        {status === "success" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-[9px] font-bold mt-2 italic">✓ KOD UYGULANDI</motion.p>}
        {status === "error" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[9px] font-bold mt-2 italic">✕ GEÇERSİZ KOD</motion.p>}
      </AnimatePresence>
    </div>
  );
}