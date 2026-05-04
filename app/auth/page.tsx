"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, AlertCircle, UserCheck, LogOut, ArrowRight, X, Globe, Search } from "lucide-react";

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
  { code: "+7", flag: "🇰🇿", label: "Kazakhstan" },
  { code: "+380", flag: "🇺🇦", label: "Ukraine" },
  { code: "+48", flag: "🇵🇱", label: "Poland" },
  { code: "+45", flag: "🇩🇰", label: "Denmark" },
  { code: "+46", flag: "🇸🇪", label: "Sweden" },
  { code: "+47", flag: "🇳🇴", label: "Norway" },
  { code: "+358", flag: "🇫🇮", label: "Finland" },
  { code: "+351", flag: "🇵🇹", label: "Portugal" },
  { code: "+30", flag: "🇬🇷", label: "Greece" },
  { code: "+974", flag: "🇶🇦", label: "Qatar" },
  { code: "+965", flag: "🇰🇼", label: "Kuwait" },
  { code: "+968", flag: "🇴🇲", label: "Oman" },
  { code: "+973", flag: "🇧🇭", label: "Bahrain" },
  { code: "+20", flag: "🇪🇬", label: "Egypt" },
  { code: "+212", flag: "🇲🇦", label: "Morocco" },
  { code: "+353", flag: "🇮🇪", label: "Ireland" },
  { code: "+420", flag: "🇨🇿", label: "Czechia" },
  { code: "+36", flag: "🇭🇺", label: "Hungary" },
  { code: "+40", flag: "🇷🇴", label: "Romania" },
  { code: "+359", flag: "🇧🇬", label: "Bulgaria" },
  { code: "+385", flag: "🇭🇷", label: "Croatia" },
  { code: "+381", flag: "🇷🇸", label: "Serbia" },
  { code: "+356", flag: "🇲🇹", label: "Malta" },
  { code: "+372", flag: "🇪🇪", label: "Estonia" },
  { code: "+370", flag: "🇱🇹", label: "Lithuania" },
  { code: "+371", flag: "🇱🇻", label: "Latvia" },
  { code: "+354", flag: "🇮🇸", label: "Iceland" },
  { code: "+382", flag: "🇲🇪", label: "Montenegro" },
  { code: "+355", flag: "🇦🇱", label: "Albania" },
  { code: "+389", flag: "🇲🇰", label: "North Macedonia" },
  { code: "+387", flag: "🇧🇦", label: "Bosnia" },
  { code: "+375", flag: "🇧🇾", label: "Belarus" },
  { code: "+65", flag: "🇸🇬", label: "Singapore" },
  { code: "+60", flag: "🇲🇾", label: "Malaysia" },
  { code: "+66", flag: "🇹🇭", label: "Thailand" },
  { code: "+62", flag: "🇮🇩", label: "Indonesia" },
  { code: "+84", flag: "🇻🇳", label: "Vietnam" },
  { code: "+63", flag: "🇵🇭", label: "Philippines" },
  { code: "+54", flag: "🇦🇷", label: "Argentina" },
  { code: "+56", flag: "🇨🇱", label: "Chile" },
  { code: "+57", flag: "🇨🇴", label: "Colombia" },
  { code: "+51", flag: "🇵🇪", label: "Peru" },
  { code: "+92", flag: "🇵🇰", label: "Pakistan" },
  { code: "+98", flag: "🇮🇷", label: "Iran" },
  { code: "+964", flag: "🇮🇶", label: "Iraq" },
  { code: "+216", flag: "🇹🇳", label: "Tunisia" },
  { code: "+213", flag: "🇩🇿", label: "Algeria" },
  { code: "+218", flag: "🇱🇾", label: "Libya" }
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

export default function AuthPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [identityNo, setIdentityNo] = useState("");
  const [countryCode, setCountryCode] = useState("+90");
  
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [showKvkkModal, setShowKvkkModal] = useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") setIsLogin(false);
    else if (mode === "login") setIsLogin(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
      }
    });
  }, [searchParams]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setCurrentUser(null);
    setLoading(false);
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
        const redirect = searchParams.get("redirect");
        const vehicle = searchParams.get("vehicle");
        router.push(redirect === "arac-secimi" ? `/arac-secimi?vehicle=${vehicle}` : "/");
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

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />
      
      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[2px]" />
      </div>

      <section className="flex-1 flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/10 rounded-full blur-[60px] pointer-events-none" />

          {currentUser ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-6">
              <div className="w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center relative shadow-sm">
                <UserCheck size={40} className="text-emerald-500 relative z-10" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic text-luxury-dark">
                {lang === 'tr' ? "OTURUM AÇIK" : "ALREADY LOGGED IN"}
              </h2>
              <p className="text-luxury-gray text-[11px] leading-relaxed font-bold max-w-[280px]">
                {lang === 'tr' 
                  ? `Şu anda ${currentUser.user_metadata?.first_name || currentUser.email} olarak giriş yapmış durumdasınız. Farklı bir hesaba geçmek veya yeniden kayıt olmak için lütfen çıkış yapın.` 
                  : `You are currently logged in as ${currentUser.user_metadata?.first_name || currentUser.email}. Please log out to switch accounts.`}
              </p>
              
              <div className="w-full flex flex-col gap-3 mt-4">
                <button 
                  onClick={() => router.push('/')}
                  className="w-full bg-gold hover:bg-luxury-black text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 shadow-lg"
                >
                  {lang === 'tr' ? "ANA SAYFAYA DÖN" : "GO TO HOMEPAGE"} <ArrowRight size={14} />
                </button>
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full bg-cream border border-cream-dark hover:border-red-200 hover:bg-red-50 text-red-500 font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> {lang === 'tr' ? "GÜVENLİ ÇIKIŞ YAP" : "SECURE LOGOUT"}
                </button>
              </div>
            </motion.div>
          ) : isSuccessScreen ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-6">
              <div className="w-24 h-24 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center relative shadow-sm">
                <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping" />
                <MailCheck size={40} className="text-gold relative z-10" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic text-luxury-dark">
                {lang === 'tr' ? "ONAY BEKLENİYOR" : "VERIFICATION REQUIRED"}
              </h2>
              <p className="text-luxury-gray text-[11px] leading-relaxed font-bold max-w-[280px]">
                {lang === 'tr' 
                  ? "Aramıza hoş geldin! Hesabını aktifleştirmek için e-posta adresine bir onay linki gönderdik. Lütfen gelen kutunu (ve Gereksiz/Spam klasörünü) kontrol et." 
                  : "Welcome! We've sent a verification link to your email. Please check your inbox (and Spam folder) to activate your account."}
              </p>
              <button 
                onClick={() => { setIsSuccessScreen(false); setIsLogin(true); }}
                className="w-full bg-gold hover:bg-luxury-black text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-[0.3em] mt-4 shadow-lg"
              >
                {lang === 'tr' ? "GİRİŞ SAYFASINA DÖN" : "BACK TO LOGIN"}
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-luxury-dark text-xl md:text-2xl font-black uppercase tracking-[0.3em] text-center mb-10 italic">
                {isLogin ? t.loginTitle : t.registerTitle}
              </h2>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }} 
                    animate={{ opacity: 1, y: 0, height: "auto" }} 
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 overflow-hidden shadow-sm"
                  >
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-red-600 leading-relaxed uppercase tracking-wider">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-4" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">Ad</label>
                      <input name="firstName" required className="w-full bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic placeholder:text-luxury-gray/40 shadow-inner" placeholder="Adınız" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">Soyad</label>
                      <input name="lastName" required className="w-full bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic placeholder:text-luxury-gray/40 shadow-inner" placeholder="Soyadınız" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">T.C. Kimlik No</label>
                      <input 
                        value={identityNo}
                        onChange={(e) => handleNumericChange(e, setIdentityNo)}
                        required 
                        maxLength={11} 
                        className="w-full bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic placeholder:text-luxury-gray/40 shadow-inner" 
                        placeholder="11 Haneli TC No" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">Doğum Tarihi</label>
                      <input name="birthDate" type="date" required className="w-full bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic shadow-inner" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">Telefon</label>
                      <div className="flex gap-2">
                        <div className="relative min-w-[90px]">
                          <button 
                            type="button"
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className="w-full h-[52px] bg-cream/30 border border-cream-dark rounded-2xl flex items-center justify-center gap-1.5 text-[10px] font-black hover:border-gold transition-all px-2 shadow-inner"
                          >
                            <Globe size={12} className="text-gold" /> {countryCode}
                          </button>
                          <AnimatePresence>
                            {isCountryOpen && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-white border border-cream-dark rounded-2xl shadow-2xl z-[100] p-2 overflow-hidden flex flex-col max-h-64">
                                <div className="relative p-2 border-b border-cream-dark/50">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={12} />
                                  <input type="text" placeholder="Ülke Ara..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-cream/30 pl-8 pr-3 py-2 rounded-lg text-[10px] font-bold outline-none"/>
                                </div>
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                  {filteredCountryCodes.map(c => (
                                    <button 
                                      type="button"
                                      key={c.code + c.label} 
                                      onClick={() => {setCountryCode(c.code); setIsCountryOpen(false);}} 
                                      className="w-full flex items-center justify-between p-3 hover:bg-gold/5 rounded-xl transition-all text-left"
                                    >
                                      <span className="text-[9px] font-black text-luxury-dark">{c.label}</span>
                                      <span className="text-[9px] font-black text-gold">{c.code}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <input 
                          type="tel"
                          value={phone}
                          onChange={(e) => handleNumericChange(e, setPhone)}
                          required 
                          className="flex-1 bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic placeholder:text-luxury-gray/40 shadow-inner" 
                          placeholder="5xx xxx xx xx" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">{isLogin ? "E-Posta" : t.email}</label>
                  <input name="email" type="email" required className="w-full bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic placeholder:text-luxury-gray/40 shadow-inner" placeholder="vip@xremtransfer.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-luxury-gray font-black uppercase tracking-widest ml-1 italic">{t.password}</label>
                  <input name="password" type="password" required className="w-full bg-cream/30 border border-cream-dark p-4 rounded-2xl outline-none focus:border-gold focus:bg-white text-luxury-dark text-[11px] transition-all italic placeholder:text-luxury-gray/40 shadow-inner" placeholder="••••••••" />
                </div>

                {!isLogin && (
                  <div className="flex items-start gap-3 pt-3">
                    <input 
                      type="checkbox" 
                      required 
                      className="mt-0.5 w-4 h-4 accent-gold cursor-pointer shrink-0" 
                    />
                    <p className="text-[10px] font-bold text-luxury-gray leading-relaxed italic">
                      {lang === 'tr' ? (
                        <>
                          <button type="button" onClick={() => setShowKvkkModal(true)} className="text-gold underline underline-offset-2 hover:text-luxury-dark transition-colors">KVKK Aydınlatma Metni</button>'ni ve sitenin diğer tüm kurallarını okudum, kabul ediyorum.
                        </>
                      ) : (
                        <>
                          I have read and agree to the <button type="button" onClick={() => setShowKvkkModal(true)} className="text-gold underline underline-offset-2 hover:text-luxury-dark transition-colors">KVKK Privacy Policy</button> and all other site rules.
                        </>
                      )}
                    </p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-luxury-black text-white font-black py-5 rounded-2xl transition-all uppercase text-[11px] tracking-[0.3em] mt-6 disabled:opacity-50 italic shadow-lg">
                  {loading ? "..." : (isLogin ? t.loginBtn : t.registerBtn)}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-cream-dark pt-6">
                <button 
                  onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); }} 
                  className="text-[10px] text-luxury-gray hover:text-luxury-dark transition-colors uppercase font-black tracking-widest italic"
                >
                  {isLogin ? t.noAccount : t.hasAccount} 
                  <span className="text-gold ml-2 underline underline-offset-4">{isLogin ? t.registerBtn : t.loginBtn}</span>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </section>

      <AnimatePresence>
        {showKvkkModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowKvkkModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-white border border-white rounded-[3rem] shadow-2xl p-8 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-cream-dark pb-4">
                <h3 className="text-sm font-black text-luxury-dark uppercase tracking-widest italic">
                  {lang === 'tr' ? "KVKK Aydınlatma Metni" : "KVKK Privacy Policy"}
                </h3>
                <button onClick={() => setShowKvkkModal(false)} className="text-luxury-gray hover:text-gold transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-4 text-[11px] font-bold text-luxury-gray leading-relaxed space-y-6 custom-scrollbar">
                {activeKvkkData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-gold uppercase tracking-widest">{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}