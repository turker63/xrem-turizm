"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'; 
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext'; 
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, Banknote, User, LogOut, Settings, Ticket, MailCheck, AlertCircle, Search, CalendarCheck } from "lucide-react"; 
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

const ALL_LANGUAGES = [
  { code: 'tr', name: 'TR', iso: 'tr' },
  { code: 'en', name: 'EN', iso: 'gb' }, 
  { code: 'de', name: 'DE', iso: 'de' },
  { code: 'ru', name: 'RU', iso: 'ru' }
];

const CURRENCIES = [
  { code: 'TRY', symbol: '₺' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' }
];

const countryCodes = [
  { code: "+90", flag: "🇹🇷", label: "Turkey" },
  { code: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "+7", flag: "🇷🇺", label: "Russia" },
  { code: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+33", flag: "🇫🇷", label: "France" },
  { code: "+31", flag: "🇳🇱", label: "Netherlands" },
  { code: "+32", flag: "🇧🇪", label: "Belgium" },
  { code: "+41", flag: "🇨🇭", label: "Switzerland" },
  { code: "+43", flag: "🇦🇹", label: "Austria" },
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+34", flag: "🇪🇸", label: "Spain" },
  { code: "+39", flag: "🇮🇹", label: "Italy" },
  { code: "+994", flag: "🇦🇿", label: "Azerbaijan" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+380", flag: "🇺🇦", label: "Ukraine" },
  { code: "+48", flag: "🇵🇱", label: "Poland" },
  { code: "+45", flag: "🇩🇰", label: "Denmark" },
  { code: "+46", flag: "🇸🇪", label: "Sweden" },
  { code: "+47", flag: "🇳🇴", label: "Norway" },
  { code: "+358", flag: "🇫🇮", label: "Finland" },
  { code: "+351", flag: "🇵 Portugal", label: "Portugal" },
  { code: "+30", flag: "🇬🇷", label: "Greece" },
  { code: "+974", flag: "🇶 Qatar", label: "Qatar" },
  { code: "+965", flag: "🇰 Kuwait", label: "Kuwait" },
  { code: "+968", flag: "🇴 Oman", label: "Oman" },
  { code: "+973", flag: "🇧 Bahrain", label: "Bahrain" },
  { code: "+20", flag: "🇪 Egypt", label: "Egypt" },
  { code: "+212", flag: "🇲 Morocco", label: "Morocco" },
  { code: "+353", flag: "🇮 Ireland", label: "Ireland" },
  { code: "+420", flag: "🇨 Czechia", label: "Czechia" },
  { code: "+36", flag: "🇭 Hungary", label: "Hungary" },
  { code: "+40", flag: "🇷 Romania", label: "Romania" },
  { code: "+359", flag: "🇧 Bulgaria", label: "Bulgaria" },
  { code: "+385", flag: "🇭 Croatia", label: "Croatia" },
  { code: "+381", flag: "🇷 Serbia", label: "Serbia" },
  { code: "+356", flag: "🇲 Malta", label: "Malta" },
  { code: "+372", flag: "🇪 Estonia", label: "Estonia" },
  { code: "+370", flag: "🇱 Lithuania", label: "Lithuania" },
  { code: "+371", flag: "🇱 Latvia", label: "Latvia" },
  { code: "+354", flag: "🇮 Iceland", label: "Iceland" },
  { code: "+382", flag: "🇲 Montenegro", label: "Montenegro" },
  { code: "+355", flag: "🇦 Albania", label: "Albania" },
  { code: "+389", flag: "🇲 North Macedonia", label: "North Macedonia" },
  { code: "+387", flag: "🇧 Bosnia", label: "Bosnia" },
  { code: "+375", flag: "🇧 Belarus", label: "Belarus" },
  { code: "+65", flag: "🇸 Singapore", label: "Singapore" },
  { code: "+60", flag: "🇲 Malaysia", label: "Malaysia" },
  { code: "+66", flag: "🇹 Thailand", label: "Thailand" },
  { code: "+62", flag: "🇮 Indonesia", label: "Indonesia" },
  { code: "+84", flag: "🇻 Vietnam", label: "Vietnam" },
  { code: "+63", flag: "🇵 Philippines", label: "Philippines" },
  { code: "+54", flag: "🇦 Argentina", label: "Argentina" },
  { code: "+56", flag: "🇨 Chile", label: "Chile" },
  { code: "+57", flag: "🇨 Colombia", label: "Colombia" },
  { code: "+51", flag: "🇵 Peru", label: "Peru" },
  { code: "+92", flag: "🇵 Pakistan", label: "Pakistan" },
  { code: "+98", flag: "🇮 Iran", label: "Iran" },
  { code: "+964", flag: "🇮 Iraq", label: "Iraq" },
  { code: "+216", flag: "🇹 Tunisia", label: "Tunisia" },
  { code: "+213", flag: "🇩 Algeria", label: "Algeria" },
  { code: "+218", flag: "🇱 Libya", label: "Libya" }
];

const kvkkData = {
  tr: [
    { title: "VERİ SORUMLUSU", content: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz veri sorumlusu olarak XREM TURİZM TAŞIMACILIK LTD. ŞTİ. tarafından saniyeler içinde aşağıda açıklanan kapsamda işlenebilecektir." },
    { title: "VERİLERİN İŞLENME AMACI", content: "Kişisel verileriniz; transfer hizmetlerimizin saniyeler içinde planlanması, lojistik operasyonların mühürlenmesi, rezervasyon süreçlerinin yönetimi, yasal yükümlülüklerin yerine getirilmesi ve VIP hizmet kalitemizin artırılması amacıyla işlenmektedir." },
    { title: "AKTARILAN ÜÇÜNCÜ TARAFLAR", content: "Toplanan kişisel verileriniz; hizmetin ifası için gerekli olan iş ortaklarımıza (şoförler, saha personeli), kanunen yetkili kamu kurumlarına ve özel kişilere, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde saniyeler içinde aktarılabilmektedir." },
    { title: "TOPLAMA YÖNTEMİ VE HUKUKİ SEBEP", content: "Kişisel verileriniz; web sitemiz, çağrı merkezimiz veya fiziksel kanallar aracılığıyla saniyeler içinde, sözleşmenin kurulması ve ifası, veri sorumlusunun hukuki yükümlülüğü ve ilgili kişinin temel haklarına zarar vermemek kaydıyla meşru menfaatler sebebiyle toplanır." },
    { title: "VERİ SAHİBİNİN HAKLARI (MADDE 11)", content: "Herkes, veri sorumlusuna başvurarak kendisiyle ilgili; verilerinin işlenip işlenmediğini öğrenme, düzeltme, silme veya yok edilmesini isteme, münhasıran otomatik sistemler vasıtasıyla analiz edilmesine itiraz etme ve zararın giderilmesini talep etme hakkına sahiptir." }
  ],
  en: [
    { title: "DATA CONTROLLER", content: "In accordance with the Personal Data Protection Law No. 6698, your personal data may be processed by XREM TURIZM TASIMACILIK LTD. STI. as the data controller within the scope described below." },
    { title: "PURPOSE OF PROCESSING DATA", content: "Your personal data is processed for the purposes of planning our transfer services, sealing logistics operations, managing reservation processes, fulfilling legal obligations, and increasing our VIP service quality." },
    { title: "TRANSFERRED THIRD PARTIES", content: "Your collected personal data may be transferred to our business partners (drivers, field personnel) necessary for the performance of the service, legally authorized public institutions and private persons within the framework of the conditions specified in Articles 8 and 9 of the KVKK." },
    { title: "COLLECTION METHOD AND LEGAL REASON", content: "Your personal data is collected through our website, call center or physical channels for the establishment and performance of the contract, the legal obligation of the data controller, and legitimate interests provided that it does not harm the fundamental rights of the data subject." },
    { title: "RIGHTS OF THE DATA SUBJECT", content: "Everyone has the right to apply to the data controller to learn whether their personal data is processed, to request correction, deletion or destruction, to object to the analysis of data exclusively through automated systems, and to demand compensation for the damage." }
  ]
};

export default function Navbar() {
  const context = useLanguage();
  const { currency, setCurrency } = useCurrency(); 
  const router = useRouter();
  const pathname = usePathname(); 
  
  const [user, setUser] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [identityNo, setIdentityNo] = useState("");
  const [countryCode, setCountryCode] = useState("+90");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null); 
  const profileRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  
  if (!context) return null;
  const { t, lang, setLang } = context;

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${targetId}`);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); 
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false);
      if (currRef.current && !currRef.current.contains(e.target as Node)) setIsCurrOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setIsCountryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setIsLogin(mode === 'login');
    setIsAuthOpen(true);
    setIsMobileOpen(false);
    setErrorMessage("");
    setIsSuccessScreen(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsMobileOpen(false);
    setIsProfileOpen(false);
    setLoading(false);
    router.push('/');
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, '');
    setter(onlyNums);
  };

  const filteredCountryCodes = countryCodes.filter(c => 
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    
    const fullPhone = !isLogin ? `${countryCode}${phone}` : "";

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage(lang === 'tr' ? "Giriş yapabilmek için lütfen e-posta adresinize gönderdiğimiz onay linkine tıklayın." : "Please verify your email address before logging in.");
        } else if (error.message.includes("Invalid login credentials")) {
          setErrorMessage(lang === 'tr' ? "E-posta adresiniz veya şifreniz hatalı." : "Invalid email or password.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const redirect = urlParams?.get("redirect");
        const vehicle = urlParams?.get("vehicle");
        
        setIsAuthOpen(false);
        if (redirect === "arac-secimi") {
          router.push(`/arac-secimi?vehicle=${vehicle}`);
        }
      }
    } else {
      const { data: phoneCheck } = await supabase
        .from("profiles")
        .select("phone")
        .eq("phone", fullPhone)
        .maybeSingle();

      if (phoneCheck) {
        setErrorMessage(lang === 'tr' ? "Bu telefon numarası zaten sistemimizde kayıtlı! Lütfen giriş yapın." : "This phone number is already registered! Please log in.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { 
            first_name: firstName, 
            last_name: lastName, 
            phone: fullPhone,
            identity_no: identityNo,
            birth_date: formData.get("birthDate")
          }
        }
      });
      
      if (error) {
        const errMsg = error.message;

        if (errMsg.includes("profiles_phone_key") || errMsg.includes("unique constraint")) {
          setErrorMessage(lang === 'tr' ? "Bu telefon numarası zaten kullanımda!" : "This phone number is already registered!");
        } 
        else if (errMsg.includes("Password should contain at least one character of each")) {
          setErrorMessage(lang === 'tr' ? "Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir." : "Your password must contain at least one uppercase letter, one lowercase letter, and one number.");
        }
        else if (errMsg.includes("Password should be at least")) {
          setErrorMessage(lang === 'tr' ? "Şifreniz en az 6 karakter uzunluğunda olmalıdır." : "Your password must be at least 6 characters long.");
        }
        else if (errMsg.includes("User already registered")) {
          setErrorMessage(lang === 'tr' ? "Bu e-posta adresi zaten kayıtlı! Lütfen giriş yapın." : "This email is already registered! Please log in.");
        }
        else {
          setErrorMessage(errMsg);
        }
      } else if (data?.user?.identities && data.user.identities.length === 0) {
        setErrorMessage(lang === 'tr' ? "Bu e-posta adresi zaten kullanımda! Lütfen giriş yapın." : "This email is already in use! Please log in.");
      } else {
        setIsSuccessScreen(true);
      }
    }
    setLoading(false);
  };

  const currentLanguage = lang === 'en' ? 'en' : 'tr';
  const activeKvkkData = kvkkData[currentLanguage];
  // Yazıların her zaman tam görünür (100% opak) olması için drop-shadow ve net renkler kullanıldı
  const textStyle = scrolled ? "text-[#2C2C2C] hover:text-[#dbc19f]" : "text-white hover:text-[#dbc19f] drop-shadow-md";

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[9990] px-6 py-5 md:px-12 md:py-6 flex justify-between items-center transition-all duration-500 ${(isMobileOpen || isAuthOpen) ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-black/40 backdrop-blur-sm border-b border-white/10'}`}>
        
        <div className="flex items-center gap-4 md:gap-6 opacity-100"> {/* İçerik opaklığı 100 */}
          <Link href="/" className="shrink-0">
            <img src="/logo.png" alt="XREM VIP" className={`h-10 md:h-12 object-contain transition-all duration-500 ${scrolled ? '' : 'brightness-0 invert drop-shadow-lg'}`} />
          </Link>

          <Link href="/sorgula" className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-500 text-[10px] font-black tracking-widest uppercase ${scrolled ? 'border-gray-200 text-[#2C2C2C] hover:bg-gray-50' : 'border-white/30 text-white hover:bg-white/10 drop-shadow-md'}`}>
            <Ticket size={14} className="text-[#dbc19f]" /> BİLET SORGULA
          </Link>

          <Link href="/rezervasyon-yap" className={`hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-500 text-[10px] font-black tracking-widest uppercase shadow-md hover:scale-105 hover:shadow-lg ${scrolled ? 'bg-[#dbc19f] text-white hover:bg-[#c8ae8b]' : 'bg-[#dbc19f] text-white hover:bg-white hover:text-[#dbc19f]'}`}>
            <CalendarCheck size={14} /> REZERVASYON YAP
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 opacity-100"> {/* İçerik opaklığı 100 */}
          <div className={`hidden lg:flex items-center gap-6 border-r pr-6 mr-2 transition-colors ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
            {!user ? (
              <>
                <button onClick={() => openAuth('login')} className={`text-[11px] font-black tracking-widest uppercase transition-colors ${textStyle}`}>
                  GİRİŞ YAP
                </button>
                <button onClick={() => openAuth('register')} className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-lg border ${scrolled ? 'bg-[#dbc19f] text-white hover:bg-[#c8ae8b] border-transparent' : 'bg-transparent text-white border-white/50 hover:bg-white/10'}`}>
                  KAYIT OL
                </button>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-colors ${textStyle}`}>
                  <User size={16} className="text-[#dbc19f]" /> <span>{user.user_metadata?.first_name || "PROFİL"}</span> <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-2 min-w-[150px] shadow-xl">
                      <Link href="/profil" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2 p-3 text-[10px] font-black text-[#2C2C2C] hover:text-[#dbc19f] transition-all"><Settings size={14} className="text-[#dbc19f]" /> PROFİLİM</Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 p-3 text-[10px] font-black text-red-500 hover:text-red-600 transition-all border-t border-gray-100"><LogOut size={14} /> ÇIKIŞ YAP</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="relative" ref={currRef}>
            <button onClick={() => setIsCurrOpen(!isCurrOpen)} className={`flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-colors ${textStyle}`}>
              <Banknote size={16} className="text-[#dbc19f]" /> <span>{currency}</span> <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {isCurrOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-2 min-w-[100px] shadow-xl">
                  {CURRENCIES.map((c) => (
                    <button key={c.code} onClick={() => { setCurrency(c.code as any); setIsCurrOpen(false); }} className="w-full text-left p-3 text-[10px] font-black text-[#2C2C2C] hover:text-[#D4AF37] transition-all">{c.code} ({c.symbol})</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={langRef}>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className={`flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-colors ${textStyle}`}>
              <Globe size={16} className="text-[#dbc19f]" /> <span>{lang.toUpperCase()}</span> <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl p-2 min-w-[100px] shadow-xl">
                  {ALL_LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setIsLangOpen(false); }} className="w-full text-left p-3 text-[10px] font-black text-[#2C2C2C] hover:text-[#D4AF37] transition-all">{l.name}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setIsMobileOpen(true)} className={`transition-colors ml-2 ${textStyle} opacity-100`}>
            <Menu size={32} />
          </button>
        </div>
      </nav>

      {/* Menü İçerikleri (Mobil ve Auth) Aynen Korundu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="fixed inset-0 bg-white z-[9999] flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-64 md:w-[30rem] h-64 md:h-[30rem] bg-[#C88A83] rounded-br-[100%] opacity-40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 md:w-[40rem] h-96 md:h-[40rem] bg-[#E8CD89] rounded-bl-[100%] opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 md:w-[35rem] h-80 md:h-[35rem] bg-[#4CBEC4] rounded-tr-[100%] opacity-40 pointer-events-none" />

            <div className="absolute top-8 right-8 z-[10000]">
              <button onClick={() => setIsMobileOpen(false)} className="text-[#2C2C2C] hover:text-[#dbc19f] hover:rotate-90 transition-all duration-300">
                <X size={44} strokeWidth={2.5} />
              </button>
            </div>

            <div className="relative z-10 w-full h-full flex flex-col items-center pt-20 pb-10 px-6 overflow-y-auto custom-scrollbar">
              <img src="/logo.png" alt="Logo" className="h-12 md:h-16 mb-12 object-contain shrink-0" />

              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
                
                <div className="flex flex-col gap-5 text-center md:text-left">
                  <h4 className="text-[#dbc19f] font-black text-[11px] tracking-[0.2em] uppercase border-b border-gray-200 pb-3 mb-2">HIZLI ERİŞİM & REZERVASYON</h4>
                  <Link href="/" onClick={() => setIsMobileOpen(false)} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest">Ana Sayfa</Link>
                  <Link href="/sorgula" onClick={() => setIsMobileOpen(false)} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest">Bilet Sorgula</Link>
                  <Link href="/rezervasyon-yap" onClick={() => setIsMobileOpen(false)} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest">Rezervasyon Yap</Link>
                  <a href="/#routes" onClick={(e) => handleHashLink(e, 'routes')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">Popüler Rotalar</a>
                  <Link href="/bolgeler" onClick={() => setIsMobileOpen(false)} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest">Tüm Bölgeler</Link>
                </div>

                <div className="flex flex-col gap-5 text-center md:text-left">
                  <h4 className="text-[#dbc19f] font-black text-[11px] tracking-[0.2em] uppercase border-b border-gray-200 pb-3 mb-2">HİZMETLER & FİLO</h4>
                  <a href="/#services" onClick={(e) => handleHashLink(e, 'services')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">Hizmetlerimiz</a>
                  <a href="/#how-it-works" onClick={(e) => handleHashLink(e, 'how-it-works')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">Nasıl Çalışır?</a>
                  <a href="/#vehicles" onClick={(e) => handleHashLink(e, 'vehicles')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">VIP Filomuz</a>
                  <a href="/#features" onClick={(e) => handleHashLink(e, 'features')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">Ayrıcalıklarımız</a>
                </div>

                <div className="flex flex-col gap-5 text-center md:text-left">
                  <h4 className="text-[#dbc19f] font-black text-[11px] tracking-[0.2em] uppercase border-b border-gray-200 pb-3 mb-2">KURUMSAL</h4>
                  <a href="/#reviews" onClick={(e) => handleHashLink(e, 'reviews')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">Müşteri Yorumları</a>
                  <a href="/#faq" onClick={(e) => handleHashLink(e, 'faq')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">Sıkça Sorulan Sorular</a>
                  <a href="/#partners" onClick={(e) => handleHashLink(e, 'partners')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">İş Ortaklarımız</a>
                  <a href="/#booking" onClick={(e) => handleHashLink(e, 'booking')} className="text-sm md:text-base font-bold text-[#2C2C2C] hover:text-[#dbc19f] transition-colors uppercase tracking-widest cursor-pointer">İletişim</a>
                </div>

              </div>

              <div className="w-full max-w-2xl mt-auto pt-10">
                <div className="flex flex-col md:flex-row gap-4 border-t border-gray-200 pt-8">
                  {!user ? (
                    <>
                      <button onClick={() => openAuth('login')} className="flex-1 py-4 text-center text-[11px] font-black text-[#2C2C2C] uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">GİRİŞ YAP</button>
                      <button onClick={() => openAuth('register')} className="flex-1 py-4 text-center text-[11px] font-black text-white bg-[#dbc19f] uppercase tracking-widest hover:bg-[#c8ae8b] rounded-xl transition-colors shadow-lg">KAYIT OL</button>
                    </>
                  ) : (
                    <>
                      <Link href="/profil" onClick={() => setIsMobileOpen(false)} className="flex-1 py-4 text-center text-[11px] font-black text-[#2C2C2C] uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">PROFİLİM</Link>
                      <button onClick={handleLogout} className="flex-1 py-4 text-center text-[11px] font-black text-white bg-red-500 uppercase tracking-widest hover:bg-red-600 rounded-xl transition-colors shadow-lg">ÇIKIŞ YAP</button>
                    </>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto custom-scrollbar">
            
            <div className="fixed top-0 left-0 w-64 h-64 bg-[#C88A83] rounded-br-[100%] opacity-40 pointer-events-none" />
            <div className="fixed top-0 right-0 w-96 h-96 bg-[#E8CD89] rounded-bl-[100%] opacity-40 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-80 h-80 bg-[#4CBEC4] rounded-tr-[100%] opacity-40 pointer-events-none" />

            <div className="absolute top-8 right-8 z-[10000]">
              <button onClick={() => setIsAuthOpen(false)} className="text-gray-400 hover:text-[#2C2C2C] hover:rotate-90 transition-transform duration-300">
                <X size={44} strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-full max-w-xl bg-white/70 backdrop-blur-2xl border border-white p-8 md:p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] relative z-10 my-12">
              {isSuccessScreen ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-6">
                  <div className="w-24 h-24 bg-[#dbc19f]/10 border border-[#dbc19f]/30 rounded-full flex items-center justify-center relative shadow-sm">
                    <div className="absolute inset-0 bg-[#dbc19f]/20 rounded-full animate-ping" />
                    <MailCheck size={40} className="text-[#dbc19f] relative z-10" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic text-[#2C2C2C]">
                    {lang === 'tr' ? "ONAY BEKLENİYOR" : "VERIFICATION REQUIRED"}
                  </h2>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-bold max-w-[280px]">
                    {lang === 'tr' 
                      ? "Aramıza hoş geldin! Hesabını aktifleştirmek için e-posta adresine bir onay linki gönderdik. Lütfen gelen kutunu (ve Gereksiz/Spam klasörünü) kontrol et." 
                      : "Welcome! We've sent a verification link to your email. Please check your inbox (and Spam folder) to activate your account."}
                  </p>
                  <button 
                    onClick={() => { setIsSuccessScreen(false); setIsLogin(true); }}
                    className="w-full bg-[#dbc19f] hover:bg-[#c8ae8b] text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-[0.3em] mt-4 shadow-lg"
                  >
                    {lang === 'tr' ? "GİRİŞ SAYFASINA DÖN" : "BACK TO LOGIN"}
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-[#2C2C2C] text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-center mb-10 italic">
                    {isLogin ? (lang === 'tr' ? 'GİRİŞ YAP' : 'LOGIN') : (lang === 'tr' ? 'KAYIT OL' : 'REGISTER')}
                  </h2>

                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 overflow-hidden shadow-sm">
                        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-red-600 leading-relaxed uppercase tracking-wider">{errorMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form className="space-y-4" onSubmit={handleAuth}>
                    {!isLogin && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">Ad</label>
                          <input name="firstName" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic placeholder:text-gray-400 shadow-inner" placeholder="Adınız" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">Soyad</label>
                          <input name="lastName" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic placeholder:text-gray-400 shadow-inner" placeholder="Soyadınız" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">T.C. Kimlik No</label>
                          <input value={identityNo} onChange={(e) => handleNumericChange(e, setIdentityNo)} required maxLength={11} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic placeholder:text-gray-400 shadow-inner" placeholder="11 Haneli TC No" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">Doğum Tarihi</label>
                          <input name="birthDate" type="date" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic shadow-inner" />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">Telefon</label>
                          <div className="flex gap-2 relative">
                            <div className="relative min-w-[95px]" ref={countryRef}>
                              <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className="w-full h-[52px] bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center gap-1.5 text-[10px] font-black hover:border-[#dbc19f] transition-all px-2 shadow-inner">
                                <Globe size={12} className="text-[#dbc19f]" /> {countryCode}
                              </button>
                              <AnimatePresence>
                                {isCountryOpen && (
                                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-2 overflow-hidden flex flex-col max-h-64">
                                    <div className="relative p-2 border-b border-gray-50">
                                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#dbc19f]" size={12} />
                                      <input type="text" placeholder="Ülke Ara..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-gray-50 pl-8 pr-3 py-2 rounded-lg text-[10px] font-bold outline-none"/>
                                    </div>
                                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                                      {filteredCountryCodes.map(c => (
                                        <button type="button" key={c.code + c.label} onClick={() => {setCountryCode(c.code); setIsCountryOpen(false);}} className="w-full flex items-center justify-between p-3 hover:bg-[#dbc19f]/10 rounded-xl transition-all text-left">
                                          <span className="text-[9px] font-black text-[#2C2C2C]">{c.label}</span>
                                          <span className="text-[9px] font-black text-[#dbc19f]">{c.code}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <input type="tel" value={phone} onChange={(e) => handleNumericChange(e, setPhone)} required className="flex-1 bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic placeholder:text-gray-400 shadow-inner" placeholder="5xx xxx xx xx" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">{isLogin ? "E-Posta" : (lang === 'tr' ? 'E-Posta' : 'Email')}</label>
                      <input name="email" type="email" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic placeholder:text-gray-400 shadow-inner" placeholder="vip@xremtransfer.com" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1 italic">{lang === 'tr' ? 'Şifre' : 'Password'}</label>
                      <input name="password" type="password" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#dbc19f] focus:bg-white text-[#2C2C2C] text-[11px] transition-all italic placeholder:text-gray-400 shadow-inner" placeholder="••••••••" />
                    </div>

                    {!isLogin && (
                      <div className="flex items-start gap-3 pt-3">
                        <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-[#dbc19f] cursor-pointer shrink-0" />
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">
                          {lang === 'tr' ? (
                            <>
                              <button type="button" onClick={() => setShowKvkkModal(true)} className="text-[#dbc19f] underline underline-offset-2 hover:text-[#2C2C2C] transition-colors">KVKK Aydınlatma Metni</button>'ni ve sitenin diğer tüm kurallarını okudum, kabul ediyorum.
                            </>
                          ) : (
                            <>
                              I have read and agree to the <button type="button" onClick={() => setShowKvkkModal(true)} className="text-[#dbc19f] underline underline-offset-2 hover:text-[#2C2C2C] transition-colors">KVKK Privacy Policy</button> and all other site rules.
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-[#dbc19f] hover:bg-[#c8ae8b] text-white font-black py-5 rounded-2xl transition-all uppercase text-[11px] tracking-[0.3em] mt-6 disabled:opacity-50 italic shadow-lg">
                      {loading ? "..." : (isLogin ? (lang === 'tr' ? 'GİRİŞ YAP' : 'LOGIN') : (lang === 'tr' ? 'KAYIT OL' : 'REGISTER'))}
                    </button>
                  </form>

                  <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); }} className="text-[10px] text-gray-500 hover:text-[#2C2C2C] transition-colors uppercase font-black tracking-widest italic">
                      {isLogin ? (lang === 'tr' ? 'Hesabınız yok mu?' : 'No account?') : (lang === 'tr' ? 'Zaten hesabınız var mı?' : 'Already have an account?')} 
                      <span className="text-[#dbc19f] ml-2 underline underline-offset-4">{isLogin ? (lang === 'tr' ? 'KAYIT OL' : 'REGISTER') : (lang === 'tr' ? 'GİRİŞ YAP' : 'LOGIN')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKvkkModal && (
          <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowKvkkModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white border border-gray-100 rounded-[3rem] shadow-2xl p-8 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-sm font-black text-[#2C2C2C] uppercase tracking-widest italic">
                  {lang === 'tr' ? "KVKK Aydınlatma Metni" : "KVKK Privacy Policy"}
                </h3>
                <button onClick={() => setShowKvkkModal(false)} className="text-gray-400 hover:text-[#dbc19f] transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-4 text-[11px] font-bold text-gray-500 leading-relaxed space-y-6 custom-scrollbar">
                {activeKvkkData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-[#dbc19f] uppercase tracking-widest">{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}