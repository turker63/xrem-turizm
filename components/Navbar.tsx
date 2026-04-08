"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext'; 
import { supabase } from '@/lib/supabase'; 
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "./NotificationBell"; 
import { Search, Menu, X, Rocket, UserPlus, User, LogOut, Settings, ChevronDown, Globe } from "lucide-react"; 

// 🌍 DESTEKLENEN TÜM DİLLER VE BAYRAKLARI
const ALL_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
  { code: 'la', name: 'Latine', flag: '🏛️' },
];

export default function Navbar() {
  const context = useLanguage();
  const { settings } = useSettings(); 
  const router = useRouter();
  const [user, setUser] = useState<any>(null); 
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isLangOpen, setIsLangOpen] = useState(false); // 🌐 Dil menüsü state'i
  const [scrolled, setScrolled] = useState(false); 
  
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const langRef = useRef<HTMLDivElement>(null); // 🌐 Dil menüsü ref'i
  
  if (!context) return null;
  const { t, lang, setLang } = context;

  const currentLangObj = ALL_LANGUAGES.find(l => l.code === lang) || ALL_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileOpen(false);
    setIsProfileOpen(false);
    router.push('/');
  };

  const navLinks = [
    { name: t.home, href: "/" },
    { name: t.fleet, href: "/#vehicles" },
    { name: t.regions, href: "/bolgeler" },
    { name: t.sss, href: "/sss" },
    { name: t.services, href: "/hizmetler" },
    { name: t.contact, href: "/iletisim" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[500] transition-all duration-500 ${scrolled ? 'py-2' : 'py-4 md:py-6'}`}>
        <div className={`mx-auto max-w-[98%] md:max-w-7xl transition-all duration-500 rounded-[1.2rem] md:rounded-full border px-3 md:px-8 flex justify-between items-center ${scrolled ? 'bg-cream-dark/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(191,149,63,0.08)] border-cream-dark py-2' : 'bg-cream-dark shadow-sm border-cream-dark/50 py-3'}`}>
          
          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
            <Link href="/" className="shrink-0">
              <motion.img 
                whileHover={{ scale: 1.05 }} 
                src="/logo.png" 
                alt={settings?.site_name || "XREM Logo"} 
                className="h-8 md:h-7 w-auto object-contain cursor-pointer transition-all" 
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link href="/rezervasyon-yap">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-gold text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic flex items-center gap-1.5 shadow-[0_4px_15px_rgba(191,149,63,0.4)]">
                  <Rocket size={10} /> {lang === 'tr' ? 'REZERVASYON YAP' : (lang === 'en' ? 'BOOK NOW' : t.bookNow)}
                </motion.div>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-center gap-6 text-[11px] font-black text-luxury-gray uppercase tracking-[0.3em] italic">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold transition-all relative group whitespace-nowrap">{link.name}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end min-w-0">
            
            {/* 👤 PROFİL ALANI */}
            <div className="hidden sm:flex items-center gap-3 shrink-0 relative" ref={dropdownRef}>
              {user ? (
                <div className="flex items-center gap-4 text-luxury-dark">
                  <NotificationBell />
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="text-[8px] md:text-[9px] font-black uppercase text-luxury-dark italic hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <User size={12} className="text-gold" />
                      {user.user_metadata?.first_name}
                    </button>
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-4 w-44 bg-white border border-cream-dark rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-2 z-[600]"
                        >
                          <Link href="/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 hover:bg-cream-dark/50 rounded-xl transition-all group">
                            <Settings size={14} className="text-gold" />
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-black uppercase italic text-luxury-dark">{t.profile}</span>
                              <span className="text-[7px] text-luxury-gray font-bold uppercase">XREM PRESTIGE</span>
                            </div>
                          </Link>
                          <div className="h-[1px] bg-cream-dark my-1 mx-2" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50/50 rounded-xl transition-all group text-left">
                            <LogOut size={14} className="text-red-500" />
                            <span className="text-[9px] font-black uppercase italic text-luxury-gray group-hover:text-red-600">{t.logoutBtn}</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth?mode=login" className="text-[8px] md:text-[9px] font-black uppercase text-luxury-dark hover:text-gold transition-colors tracking-widest italic whitespace-nowrap">
                    {t.loginBtn}
                  </Link>
                </div>
              )}
            </div>

            {/* 🌐 GLOBAL DİL SEÇİCİ (DROPDOWN) */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)} 
                className="bg-white/50 border border-cream-dark text-luxury-dark px-3 py-1.5 md:h-10 flex items-center gap-2 rounded-full text-[10px] font-black hover:border-gold transition-all shrink-0 shadow-sm"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden md:block uppercase">{currentLangObj.code}</span>
                <ChevronDown size={12} className={`text-gold transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-48 bg-white border border-cream-dark rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2 z-[600] max-h-[400px] overflow-y-auto custom-scrollbar"
                  >
                    {ALL_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-0.5 ${lang === l.code ? 'bg-gold/10 text-gold' : 'hover:bg-cream-dark/50 text-luxury-dark'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{l.flag}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">{l.name}</span>
                        </div>
                        {lang === l.code && <div className="w-1.5 h-1.5 bg-gold rounded-full" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden text-luxury-dark p-1 shrink-0">
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-cream-dark/95 z-[450] lg:hidden flex flex-col p-8 overflow-y-auto"
          >
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex flex-col gap-8 w-full max-w-[320px] mx-auto pt-24 pb-12">
              <nav className="flex flex-col gap-4 text-center">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className="text-xl font-black italic text-luxury-dark uppercase tracking-tighter hover:text-gold transition-colors">{link.name}</Link>
                ))}
              </nav>

              <div className="h-[1px] w-12 bg-cream-dark mx-auto" />

              {/* MOBILE DİL SEÇİMİ */}
              <div className="grid grid-cols-4 gap-2">
                {ALL_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsMobileOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${lang === l.code ? 'bg-gold border-gold text-white' : 'bg-white border-cream-dark text-luxury-dark'}`}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span className="text-[8px] font-black uppercase">{l.code}</span>
                  </button>
                ))}
              </div>

              <div className="h-[1px] w-12 bg-cream-dark mx-auto" />

              <div className="flex flex-col gap-3">
                {!user ? (
                  <Link href="/auth?mode=login" onClick={() => setIsMobileOpen(false)}>
                    <div className="bg-gold text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(191,149,63,0.2)] hover:bg-[#a67c00] transition-all">
                      <User size={18} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{t.loginBtn}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-4 items-center text-center">
                    <Link href="/profil" onClick={() => setIsMobileOpen(false)} className="text-xl font-black italic text-luxury-dark uppercase underline underline-offset-8 decoration-gold/30 leading-tight">
                      {user.user_metadata?.first_name}
                    </Link>
                    <button onClick={handleLogout} className="text-[10px] font-black uppercase text-red-500 tracking-[0.5em] italic">{t.logoutBtn}</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}