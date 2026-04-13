"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext'; 
import { supabase } from '@/lib/supabase'; 
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "./NotificationBell"; 
import { Search, Menu, X, Rocket, UserPlus, User, LogOut, Settings, ChevronDown } from "lucide-react"; 


const ALL_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', iso: 'tr' },
  { code: 'en', name: 'English', iso: 'gb' }, 
  { code: 'de', name: 'Deutsch', iso: 'de' },
  { code: 'ru', name: 'Русский', iso: 'ru' },
  { code: 'es', name: 'Español', iso: 'es' },
  { code: 'it', name: 'Italiano', iso: 'it' },
  { code: 'pt', name: 'Português', iso: 'pt' },
  { code: 'el', name: 'Ελληνικά', iso: 'gr' },
  { code: 'bg', name: 'Български', iso: 'bg' },
  { code: 'ka', name: 'ქართული', iso: 'ge' },
  { code: 'la', name: 'Latine', iso: 'va' }, 
];

export default function Navbar() {
  const context = useLanguage();
  const { settings } = useSettings(); 
  const router = useRouter();
  const [user, setUser] = useState<any>(null); 
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); 
  
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const langRef = useRef<HTMLDivElement>(null);
  
  if (!context) return null;
  const { t, lang, setLang } = context;

  const currentLangObj = ALL_LANGUAGES.find(l => l.code === lang) || ALL_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
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
        <div className={`mx-auto max-w-[98%] md:max-w-7xl transition-all duration-500 rounded-[1.2rem] md:rounded-full border px-3 md:px-8 flex justify-between items-center ${scrolled ? 'bg-cream-dark/90 backdrop-blur-xl shadow-xl border-cream-dark py-2' : 'bg-cream-dark shadow-sm border-cream-dark/50 py-3'}`}>
          
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <Link href="/" className="shrink-0">
              <motion.img whileHover={{ scale: 1.05 }} src="/logo.png" alt="Logo" className="h-8 md:h-7 w-auto object-contain cursor-pointer" />
            </Link>
            
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link href="/rezervasyon-yap">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-gold text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic flex items-center gap-1.5 shadow-lg">
                  <Rocket size={10} /> {lang === 'tr' ? 'REZERVASYON YAP' : (lang === 'en' ? 'BOOK NOW' : t.bookNow)}
                </motion.div>
              </Link>
              <Link href="/sorgula">
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-white/20 border border-cream-dark px-3 py-1.5 rounded-full text-luxury-dark group hover:border-gold transition-all shadow-sm">
                  <Search size={10} className="text-gold" /> <span className="text-[7px] font-black uppercase tracking-[0.2em] italic">{lang === 'tr' ? 'SORGULA' : 'CHECK'}</span>
                </motion.div>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-center gap-5 text-[10px] font-black text-luxury-gray uppercase tracking-[0.2em] italic">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold transition-all relative group whitespace-nowrap">{link.name}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end min-w-0">
            
            <div className="hidden sm:flex items-center gap-3 shrink-0 relative" ref={dropdownRef}>
              {user ? (
                <div className="flex items-center gap-4 text-luxury-dark">
                  <NotificationBell />
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-[8px] md:text-[9px] font-black uppercase italic hover:text-gold transition-colors flex items-center gap-2">
                    <User size={12} className="text-gold" /> {user.user_metadata?.first_name}
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-4 w-44 bg-white border border-cream-dark rounded-2xl shadow-2xl p-2 z-[600]">
                        <Link href="/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-3 hover:bg-cream-dark/50 rounded-xl transition-all">
                          <Settings size={14} className="text-gold" /> <span className="text-[9px] font-black uppercase italic">{t.profile}</span>
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50/50 rounded-xl text-left">
                          <LogOut size={14} className="text-red-500" /> <span className="text-[9px] font-black uppercase italic text-luxury-gray">{t.logoutBtn}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth?mode=register" className="text-[8px] md:text-[9px] font-black uppercase text-luxury-gray hover:text-gold transition-colors tracking-widest italic flex items-center gap-1.5">
                    <UserPlus size={11} /> {lang === 'tr' ? 'KAYIT OL' : 'SIGN UP'}
                  </Link>
                  <div className="w-[1px] h-3 bg-cream-dark" />
                  <Link href="/auth?mode=login" className="text-[8px] md:text-[9px] font-black uppercase text-luxury-dark hover:text-gold transition-colors tracking-widest italic">
                    {t.loginBtn}
                  </Link>
                </div>
              )}
            </div>

            
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)} 
                className="bg-white border border-cream-dark text-luxury-dark px-2 py-1 md:h-9 flex items-center gap-2 rounded-full text-[10px] font-black hover:border-gold transition-all shadow-sm group"
              >
                <img 
                  src={`https://flagcdn.com/w40/${currentLangObj.iso}.png`} 
                  alt={currentLangObj.name}
                  className="w-5 h-3.5 object-cover rounded-sm shadow-sm group-hover:scale-110 transition-transform"
                />
                <span className="hidden sm:block uppercase tracking-widest">{currentLangObj.code}</span>
                <ChevronDown size={10} className={`text-gold transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                    className="absolute top-full right-0 mt-3 w-48 bg-white border border-cream-dark rounded-[1.5rem] shadow-2xl p-2 z-[600] max-h-[380px] overflow-y-auto custom-scrollbar"
                  >
                    <div className="p-2 mb-1 text-[8px] font-black text-gold uppercase tracking-[0.3em] border-b border-cream-dark/50">Select Language</div>
                    {ALL_LANGUAGES.map((l) => (
                      <button 
                        key={l.code} 
                        onClick={() => { setLang(l.code); setIsLangOpen(false); }} 
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-0.5 group/item ${lang === l.code ? 'bg-gold/10 text-gold' : 'hover:bg-cream-dark/50 text-luxury-dark'}`}
                      >
                        <img 
                          src={`https://flagcdn.com/w40/${l.iso}.png`} 
                          className="w-6 h-4 object-cover rounded-sm shadow-sm group-hover/item:scale-110 transition-transform" 
                          alt={l.name}
                        />
                        <div className="flex flex-col items-start">
                           <span className="text-[10px] font-black uppercase tracking-tight leading-none">{l.name}</span>
                           <span className="text-[7px] font-bold opacity-40 uppercase mt-1">{l.code}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden text-luxury-dark p-1">
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-cream-dark/98 z-[450] lg:hidden flex flex-col p-8 overflow-y-auto pt-24">
            <nav className="flex flex-col gap-5 text-center mb-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className="text-xl font-black italic text-luxury-dark uppercase tracking-tighter hover:text-gold">{link.name}</Link>
              ))}
            </nav>
            
            <div className="h-[1px] w-full bg-cream-dark mb-6" />
            
            <div className="grid grid-cols-4 gap-3 mb-10">
              {ALL_LANGUAGES.map((l) => (
                <button 
                  key={l.code} 
                  onClick={() => { setLang(l.code); setIsMobileOpen(false); }} 
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${lang === l.code ? 'bg-gold border-gold text-white shadow-lg' : 'bg-white border-cream-dark text-luxury-dark shadow-sm'}`}
                >
                  <img src={`https://flagcdn.com/w80/${l.iso}.png`} className="w-8 h-5 object-cover rounded-sm" alt={l.name} />
                  <span className="text-[8px] font-black uppercase">{l.code}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              {!user ? (
                <>
                  <Link href="/auth?mode=register" onClick={() => setIsMobileOpen(false)} className="bg-white border border-cream-dark text-luxury-dark py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase italic tracking-widest shadow-sm">
                    <UserPlus size={18} className="text-gold" /> KAYIT OL
                  </Link>
                  <Link href="/auth?mode=login" onClick={() => setIsMobileOpen(false)} className="bg-gold text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase italic tracking-widest shadow-xl">
                    <User size={18} /> GİRİŞ YAP
                  </Link>
                </>
              ) : (
                <div className="text-center">
                  <Link href="/profil" onClick={() => setIsMobileOpen(false)} className="text-xl font-black italic text-luxury-dark uppercase">
                    {user.user_metadata?.first_name}
                  </Link>
                  <button onClick={handleLogout} className="block w-full mt-4 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] italic">GÜVENLİ ÇIKIŞ</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}