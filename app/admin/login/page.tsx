"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, ShieldAlert, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚨 DÜZELTME: Fonksiyonun başına "async" eklendi!
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🛡️ Supabase Giriş Motoru
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Yetkisiz Giriş Denemesi! E-posta veya şifre hatalı.");
      setLoading(false);
    } else {
      // 🚨 BEYAZ LİSTE KONTROLÜ
      const { data: adminCheck } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", data.user?.email)
        .maybeSingle();
      
      // Eğer veritabanında (Beyaz Liste) yoksa ve kurucu e-posta da değilse kapı dışarı et!
      if (!adminCheck && data.user?.email !== "admin@xxremtransfer.com") {
        await supabase.auth.signOut();
        setError("ERİŞİM REDDEDİLDİ! Yetkilendirilmiş bir personel değilsiniz.");
        setLoading(false);
      } else {
        // Her şey yolunda, komuta merkezine giriş yap
        router.push("/admin");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-gold/30 relative overflow-hidden">
      {/* Arkaplan Dekorasyonları */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">COMMAND<span className="text-gold">CENTER</span></h1>
          <p className="text-[8px] text-gray-500 font-black tracking-[0.4em] uppercase mt-2">Sadece Yetkili Personel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Yönetici E-posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-700"
                placeholder="****************"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Güvenlik Şifresi</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-gray-700 tracking-widest"
                placeholder="••••••••••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <ShieldAlert className="text-red-500 flex-shrink-0" size={18} />
              <p className="text-[9px] font-black text-red-500 uppercase leading-tight italic">{error}</p>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-black font-black py-5 rounded-2xl hover:bg-white hover:text-black transition-all uppercase text-[11px] tracking-[0.3em] mt-4 shadow-xl disabled:opacity-50"
          >
            {loading ? "KİMLİK DOĞRULANIYOR..." : "SİSTEME GİRİŞ YAP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}