"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/context/LanguageContext";
import { Clock, CheckCircle2, Send, CalendarDays, Users, Timer, ChevronRight, Plus, Minus, Briefcase, Star, Map, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function KongreFuarTasimaciligiPage() {
  const { lang } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    details: ""
  });
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const passengerRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const tStrings = {
    badge: lang === 'en' ? "Corporate Logistics" : "Kurumsal Lojistik",
    title1: lang === 'en' ? "CONGRESS AND FAIR" : "KONGRE VE FUAR",
    title2: lang === 'en' ? "TRANSPORTATION" : "TAŞIMACILIĞI",
    mainHeading: lang === 'en' ? "CONGRESS & FAIR TRANSPORTATION" : "KONGRE & FUAR TAŞIMACILIĞI",
    para1: lang === 'en' 
      ? "Antalya, the pearl of the Mediterranean, is an ideal destination for congresses with its developed hotel halls and tourist areas. Our planning makes your congresses easier and more comfortable for both organizers and guests. As a leading firm, we provide services for tourism, agriculture, health, and international fairs in Antalya. Once your organization is confirmed, simply email us your guest list, flight details, and hotel information; our coordination team will handle the rest."
      : "Antalya gibi ulaşımı kolay ve herkesin gözdesi olan Akdeniz’in incisi kongreleriniz için büyük ve gelişmiş otel salonları, gezilecek yerleri ve turistik alanları ile hem kongre düzenleyen taraf hem kongre ve fuar misafirleri için en iyisini düşünerek planlanan kongreleriniz bizimle daha kolay, planlı ve konforlu olacaktır. Antalya turizm fuarı, Antalya tarım fuarı, Antalya sağlık fuarı, Antalya uluslararası fuarların Antalya Kongre ve Fuar taşıma firması olarak her türlü organizasyonlarda hizmet sunmaktayız.",
    para2: lang === 'en'
      ? "We offer a wide range of vehicles including buses, midibuses, minibuses, and Mercedes VIP Vito, S-Class, or E-Class for special guests. We comfortably serve groups ranging from 500 to 10,000 people. Our expertise covers hotel transfers, VIP transfers, and chauffeured car rentals, all handled within legal procedures and safety rules."
      : "Zamanında ve mutlu hizmet için her zaman sizlere hizmet sunmaktan mutluluk duymaktayız. Kişi kapasitesine göre otobüs, midibüs, minibüs, Mercedes vip vito, özel misafirleriniz için Mercedes s class veya e class araçlarımız ile Antalya Kongre taşımacı firması, Antalya fuar taşımacı firmanız olarak planlarınıza her zaman destek olacağız. Kişi sayısı fark etmeksizin 500 – 10000 kişilik grupları rahatlıkla hizmet sunağımız her türlü Antalya kongre ve fuar taşımacılığı hizmetimiz ile her daim yanınızdayız.",
    para3: lang === 'en'
      ? "Safety and comfort are essential for event logistics. Our experienced personnel ensure that VIP vehicles carry you safely to every point of the city at any time. Partner with our firm, which stands out with years of experience in the Antalya VIP transfer sector, to reach your urban and intercity destinations without losing time."
      : "Sizlere hizmet vermekten büyük mutluluk duyacağız. Antalya kongre ve fuar taşımacılığı için güvenliğin ve konforun bir arada olması gerektiği yolculuk şeklidir. Antalya kongre ve fuar taşıma hizmetini deneyimli personellerimiz tarafından gerçekleştirilmektedir. Size özel olduğunuzu hatırlatan VIP araçlar, şehrin her noktasına, her saatte sizleri güvenle taşıyor.",
    formTitle: lang === 'en' ? "CONTACT US!" : "BİZİMLE İLETİŞİME GEÇİN!",
    formDesc: lang === 'en' ? "To get a reservation and detailed information, please fill out the form! We will call you as soon as possible." : "Rezervasyon ve detaylı bilgi almak için Lütfen aşağıdaki formu doldurarak bizimle iletişime geçin!",
    phName: lang === 'en' ? "Full Name" : "Adı Soyadı",
    phPhone: lang === 'en' ? "Phone Number" : "Telefon numaranız",
    phEmail: lang === 'en' ? "Email Address" : "E-posta Adresi",
    paxLabel: lang === 'en' ? "GROUP SIZE" : "GRUP SAYISI",
    paxValue: lang === 'en' ? `${adults} Adults, ${children} Children` : `${adults} Yetişkin, ${children} Çocuk`,
    adult: lang === 'en' ? "Adult" : "Yetişkin",
    child: lang === 'en' ? "Child (2-12 years)" : "Çocuk (2-12 yaş)",
    details: lang === 'en' ? "Organization Name, Route and Vehicle Preferences..." : "Organizasyon Adı, Güzergah ve Araç Tercihleri...",
    btnSend: lang === 'en' ? "SEND" : "GÖNDER",
    btnSending: lang === 'en' ? "SENDING..." : "GÖNDERİLİYOR...",
    successMsg: lang === 'en' ? "Your request has been sent successfully. We will call you shortly." : "Talebiniz başarıyla Gönderildi. Mümkün olan en kısa sürede sizi arayacağız."
  };

  const highlights = [
    { title: lang === 'en' ? "Corporate Fleet" : "Kurumsal Filo", desc: "S, E & V-Class", icon: Building2 },
    { title: lang === 'en' ? "Large Groups" : "Büyük Gruplar", desc: "500 - 10,000 Capacity", icon: Users },
    { title: lang === 'en' ? "Full Coordination" : "Tam Koordinasyon", desc: lang === 'en' ? "Flight & Hotel Plan" : "Uçuş ve otel planlama", icon: Map },
    { title: lang === 'en' ? "Expert Team" : "Deneyimli Ekip", desc: lang === 'en' ? "Field Personnel" : "Profesyonel saha personeli", icon: CheckCircle2 },
    { title: lang === 'en' ? "Global Standard" : "Global Standart", desc: lang === 'en' ? "International Support" : "Uluslararası fuar desteği", icon: Briefcase },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const passengerCountText = `${adults} ${lang === 'en' ? 'Adult' : 'Yetişkin'}, ${children} ${lang === 'en' ? 'Child' : 'Çocuk'}`;

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_type: 'Kongre ve Fuar Taşımacılığı',
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email,
            requested_date: formData.date,
            requested_time: formData.time,
            passenger_count: passengerCountText,
            details: formData.details
          }
        ]);

      if (error) throw error;
      
      setSubmitStatus("success");
      setFormData({ name: "", phone: "", email: "", date: "", time: "", details: "" });
      setAdults(1);
      setChildren(0);
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

      <section className="relative pt-44 pb-16 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/60 border border-white rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-6 shadow-lg">
              <Briefcase size={32} />
            </div>
            <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block italic">{tStrings.badge}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-tight mb-6">
              {tStrings.title1} <br /> <span className="text-gold">{tStrings.title2}</span>
            </h1>
            <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-lg" />
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 xl:col-span-8 space-y-12"
            >
              <div className="bg-white/40 backdrop-blur-md border border-white p-8 md:p-12 rounded-[3.5rem] shadow-xl">
                <h2 className="text-2xl font-black italic uppercase text-[#1a1a1a] mb-8 tracking-tighter">{tStrings.mainHeading}</h2>
                
                <div className="space-y-6 text-[#1a1a1a] font-bold text-sm md:text-base leading-relaxed opacity-80 text-justify">
                  <p>{tStrings.para1}</p>
                  <p>{tStrings.para2}</p>
                  <p>{tStrings.para3}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {highlights.map((item, idx) => (
                  <div key={idx} className="bg-white/40 backdrop-blur-sm border border-white p-6 rounded-[2rem] text-center flex flex-col items-center gap-3 shadow-md hover:border-gold transition-all duration-300 group">
                    <item.icon size={24} className="text-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <h5 className="text-sm font-black italic uppercase text-[#1a1a1a] tracking-tight leading-none">{item.title}</h5>
                      <p className="text-[9px] font-bold uppercase text-gray-500 tracking-wider mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.aside 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-32"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h4 className="text-[#1a1a1a] font-black text-2xl uppercase italic tracking-tighter mb-2 text-center">{tStrings.formTitle}</h4>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-8 leading-relaxed text-center opacity-80">
                  {tStrings.formDesc}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder={tStrings.phName} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner" />
                  <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder={tStrings.phPhone} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder={tStrings.phEmail} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner overflow-hidden">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <CalendarDays size={18} className="text-gray-400 group-focus-within/field:text-gold" />
                      </div>
                      <input type="date" name="date" required min={today} value={formData.date} onChange={handleChange} className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] uppercase cursor-pointer" />
                    </div>
                    <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner overflow-hidden">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Timer size={18} className="text-gray-400 group-focus-within/field:text-gold" />
                      </div>
                      <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] cursor-pointer" />
                    </div>
                  </div>

                  <div className="relative group/field bg-cream border border-cream rounded-2xl transition-all focus-within:border-gold shadow-inner" ref={passengerRef}>
                    <button type="button" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)} className="w-full flex items-center gap-4 pl-5 pr-5 py-4.5">
                      <Users size={18} className="text-gray-400 group-focus-within/field:text-gold" />
                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider block">{tStrings.paxLabel}</span>
                        <span className="text-[11px] font-bold text-gray-600 block leading-tight mt-0.5">{tStrings.paxValue}</span>
                      </div>
                      <ChevronRight size={16} className={`text-gold transition-transform duration-300 ${showPassengerDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white rounded-[2rem] p-6 shadow-2xl z-50 space-y-5">
                          <PassengerCounter title={tStrings.adult} value={adults} setValue={setAdults} min={1} />
                          <div className="h-px bg-cream" />
                          <PassengerCounter title={tStrings.child} value={children} setValue={setChildren} min={0} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <textarea name="details" required rows={3} value={formData.details} onChange={handleChange} placeholder={tStrings.details} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 transition-all shadow-inner resize-none" />
                  
                  <button type="submit" disabled={isSubmitting} className="bg-[#1a1a1a] hover:bg-gold text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-full disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? tStrings.btnSending : <>{tStrings.btnSend} <Send size={16} /></>}
                  </button>

                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/20 text-green-700 text-[10px] font-black uppercase p-4 rounded-2xl text-center">
                        {tStrings.successMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.aside>

          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

function PassengerCounter({ title, value, setValue, min }: { title: string, value: number, setValue: (val: number) => void, min: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-black uppercase text-[#1a1a1a] tracking-wider">{title}</span>
      <div className="flex items-center gap-4 bg-cream p-1.5 rounded-full border border-cream-dark shadow-inner">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gold transition-all border border-cream shadow-sm disabled:opacity-50" disabled={value <= min}><Minus size={14} strokeWidth={3} /></button>
        <span className="text-sm font-black text-[#1a1a1a] w-6 text-center">{value}</span>
        <button type="button" onClick={() => setValue(value + 1)} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-gold transition-all border border-cream shadow-sm disabled:opacity-50"><Plus size={14} strokeWidth={3} /></button>
      </div>
    </div>
  );
}