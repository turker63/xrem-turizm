"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase"; 
import { 
  LayoutDashboard, Calendar, Car, Ticket, Users, 
  Settings, LogOut, Activity, MapPin, Archive, 
  UserCheck, Shield, ChevronRight, Zap
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🛡️ GÜVENLİK KONTROLÜ
  useEffect(() => {
    const checkSecurity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (session) {
        const { data: adminCheck } = await supabase.from("admin_users").select("email").eq("email", session.user.email).maybeSingle();
        
        if (!adminCheck && session.user.email !== "admin@xxremtransfer.com") {
          await supabase.auth.signOut();
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    checkSecurity();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login'); 
  };

  // 📋 MENÜ YAPISI
  const MENU = [
    { name: "ANASAYFA", icon: <LayoutDashboard size={18} />, href: "/admin" },
    { name: "REZERVASYONLAR", icon: <Calendar size={18} />, href: "/admin/rezervasyonlar" },
    { name: "KAPTAN KADROSU", icon: <UserCheck size={18} />, href: "/admin/soforler" },
    { name: "ARAÇ FİLOSU", icon: <Car size={18} />, href: "/admin/filo" },
    { name: "TRANSFER BÖLGELERİ", icon: <MapPin size={18} />, href: "/admin/bolgeler" },
    { name: "İNDİRİM KODLARI", icon: <Ticket size={18} />, href: "/admin/indirim-kodlari" },
    { name: "MÜŞTERİ VERİTABANI", icon: <Users size={18} />, href: "/admin/musteriler" },
    { name: "İŞLEM LOGLARI", icon: <Archive size={18} />, href: "/admin/loglar" }, 
    { name: "SİSTEM YÖNETİCİLERİ", icon: <Shield size={18} />, href: "/admin/yoneticiler" },
  ];

  // ⏳ YÜKLENİYOR EKRANI
  if (isLoading) return (
    <div className="h-screen bg-[#020202] flex items-center justify-center font-black text-gold italic uppercase tracking-[0.5em] animate-pulse">
      SİSTEME BAĞLANILIYOR...
    </div>
  );

  // 🔐 LOGİN SAYFASINDA İSE LAYOUT'U GİZLE
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-white flex font-sans selection:bg-gold/30 overflow-hidden">
      
      {/* 📟 SABİT YAN MENÜ (SIDEBAR) */}
      <aside className="w-[280px] border-r border-white/5 bg-[#050505] flex flex-col fixed h-full z-[600] shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        
        {/* LOGO ALANI */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Zap size={20} className="fill-black" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">XREM<span className="text-gold">TURİZM</span></h2>
              <p className="text-[7px] font-black text-gray-500 tracking-[0.4em] mt-1.5 uppercase italic">PREMIUM TRANSFER DENEYIMI</p>
            </div>
          </motion.div>
        </div>

        {/* MENÜ LİNKLERİ */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`group flex items-center justify-between p-3.5 rounded-xl transition-all relative ${
                  isActive ? "bg-white/5 text-gold border border-white/5 shadow-lg shadow-gold/5" : "text-gray-500 hover:text-white/90 hover:bg-white/[0.02]"
                }`}>
                  <div className="flex items-center gap-4 relative z-10">
                    <span className={`${isActive ? "text-gold" : "group-hover:text-white"} transition-colors`}>{item.icon}</span>
                    <span className="text-[9px] font-black uppercase italic tracking-[0.1em]">{item.name}</span>
                  </div>
                  {/* Aktif ok işareti */}
                  {isActive && <ChevronRight size={14} className="text-gold" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ALT AYARLAR & ÇIKIŞ */}
        <div className="p-4 border-t border-white/5 bg-[#050505] space-y-2">
           <Link href="/admin/ayarlar">
             <div className={`flex items-center gap-3 p-3.5 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all cursor-pointer ${
                 pathname === "/admin/ayarlar" ? "text-gold bg-white/5 border border-white/5" : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
               }`}>
               <Settings size={16} /> <span>SİSTEM AYARLARI</span>
             </div>
           </Link>

           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 p-3.5 text-red-500/50 hover:text-red-500 transition-all text-[9px] font-black uppercase italic tracking-widest bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/5"
           >
             <LogOut size={16} /> <span>GÜVENLİ ÇIKIŞ</span>
           </button>
        </div>
      </aside>

      {/* 🚀 ANA İÇERİK ALANI (DİNAMİK SAĞ TARAF) */}
      <main className="flex-1 ml-[280px] min-h-screen relative flex flex-col h-screen">
        
        {/* ÜST DURUM ÇUBUĞU (TOP BAR) */}
        <header className="h-20 border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl z-[500] px-10 flex items-center justify-between shrink-0">
           
           <div className="flex items-center gap-3 text-[9px] font-black uppercase italic text-gray-600 tracking-[0.3em] bg-white/[0.02] px-4 py-2 rounded-full border border-white/5">
             <Activity size={12} className="text-green-500" />
             <span>AĞ DURUMU: <span className="text-green-500">ŞİFRELİ & AKTİF</span></span>
           </div>
           
           <div className="flex items-center gap-4 bg-white/[0.01] px-4 py-2 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/[0.03] transition-all">
             <div className="text-right">
               <p className="text-[10px] font-black text-white italic leading-none">ROOT ADMIN</p>
               <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest mt-1">Yetki Seviyesi: Max</p>
             </div>
             <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-black italic text-xs shadow-[0_0_15px_rgba(212,175,55,0.15)]">
               A
             </div>
           </div>
        </header>

        {/* SAYFA İÇERİĞİ (SCROLL EDİLEBİLİR ALAN) */}
        <div className="flex-1 overflow-y-auto p-10 relative custom-scrollbar">
          {/* Ortam Işığı Efekti (Hafif Gold Parlama) */}
          <div className="fixed top-20 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none z-0" />
          
          {/* Gerçek İçerik */}
          <div className="relative z-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}