"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ SAYI KONTROLÜ İÇİN STATE MÜHÜRLERİ
  const [phone, setPhone] = useState("");
  const [identityNo, setIdentityNo] = useState("");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") setIsLogin(false);
    else if (mode === "login") setIsLogin(true);
  }, [searchParams]);

  // ✅ SADECE SAYI KABUL EDEN LOJİSTİK FİLTRE
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setter(onlyNums);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      } else {
        const redirect = searchParams.get("redirect");
        const vehicle = searchParams.get("vehicle");
        router.push(redirect === "arac-secimi" ? `/arac-secimi?vehicle=${vehicle}` : "/");
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { 
            first_name: firstName, 
            last_name: lastName, 
            phone: phone, // State'den gelen temiz veri
            identity_no: identityNo, // State'den gelen temiz veri
            birth_date: formData.get("birthDate")
          }
        }
      });
      
      if (error) alert(error.message);
      else alert(lang === 'tr' ? "Kayıt başarılı! E-postanızı kontrol edin." : "Success! Check your email.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      <section className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-[60px]" />

          <h2 className="text-gold text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-center mb-10 italic">
            {isLogin ? t.loginTitle : t.registerTitle}
          </h2>

          <form className="space-y-3.5" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">Ad</label>
                  <input name="firstName" required className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[11px] transition-all italic" placeholder="Adınız" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">Soyad</label>
                  <input name="lastName" required className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[11px] transition-all italic" placeholder="Soyadınız" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">T.C. Kimlik No</label>
                  <input 
                    value={identityNo}
                    onChange={(e) => handleNumericChange(e, setIdentityNo)}
                    required 
                    maxLength={11} 
                    className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[11px] italic" 
                    placeholder="11 Haneli TC No" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">Doğum Tarihi</label>
                  <input name="birthDate" type="date" required className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[10px] italic" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">Telefon</label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => handleNumericChange(e, setPhone)}
                    required 
                    className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[11px] italic" 
                    placeholder="5xx xxx xx xx" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">{isLogin ? "E-Posta" : t.email}</label>
              <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[11px] italic" placeholder="vip@xremtransfer.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[8px] text-gold font-black uppercase tracking-widest ml-2 italic">{t.password}</label>
              <input name="password" type="password" required className="w-full bg-white/5 border border-white/10 p-3.5 h-[46px] rounded-xl outline-none focus:border-gold text-white text-[11px] italic" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gold text-black font-black py-4 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all uppercase text-[10px] tracking-[0.3em] mt-4 disabled:opacity-50 italic">
              {loading ? "..." : (isLogin ? t.loginBtn : t.registerBtn)}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-[9px] text-gray-500 hover:text-white transition-colors uppercase font-black tracking-widest italic">
              {isLogin ? t.noAccount : t.hasAccount} 
              <span className="text-gold ml-2 underline underline-offset-4">{isLogin ? t.registerBtn : t.loginBtn}</span>
            </button>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}