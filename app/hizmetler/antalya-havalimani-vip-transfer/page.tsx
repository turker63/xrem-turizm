"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/context/LanguageContext";
import { Clock, CheckCircle2, Send, CalendarDays, Users, Timer, ChevronRight, Plus, Minus, Plane, MapPin, Map, Info, Wifi, Coffee, ShieldCheck, Car } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AntalyaHavalimaniVipTransferPage() {
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
    badge: lang === 'en' ? "Official Airport Guide" : "VIP Transfer Rehberi",
    title1: lang === 'en' ? "ANTALYA AIRPORT" : "ANTALYA HAVALİMANI",
    title2: lang === 'en' ? "VIP TRANSFER GUIDE" : "VIP TRANSFER REHBERİ",
    generalInfo: lang === 'en' ? "General Information" : "Genel Bilgiler",
    generalDesc: lang === 'en' 
      ? "Antalya Airport (AYT) is located in the Yeşilköy neighborhood of Muratpaşa district, 12 km from the city center. It hosts millions of local and foreign tourists visiting Turkey's southern coasts every year. Operated by DHMİ, it's one of the busiest hubs in the Mediterranean."
      : "Antalya Havalimanı, Muratpaşa ilçesi Yeşilköy mahallesinde merkeze 12 km uzaklıktadır. Yaz aylarında Türkiye'nin güney sahillerine gelen milyonlarca yerli ve yabancı turiste ev sahipliği yapmaktadır. IATA Kodu: AYT, meydan DHMİ tarafından işletilmektedir.",
    terminals: lang === 'en' ? "Terminals" : "Terminaller",
    t1: lang === 'en' ? "International Terminal 1" : "Dış Hatlar Terminal 1",
    t2: lang === 'en' ? "International Terminal 2" : "Dış Hatlar Terminal 2",
    dom: lang === 'en' ? "Domestic Terminal" : "İç Hatlar Terminali",
    capacity: lang === 'en' ? "Capacity & Carriers" : "Kapasite & Şirketler",
    capacityDesc: lang === 'en'
      ? "Annual capacity of over 35 million passengers. Served by Turkish Airlines, Pegasus, SunExpress, and worldwide charter flights."
      : "Yıllık 35 milyondan fazla yolcu kapasitesi. THY, Pegasus, SunExpress ve dünya genelinden charter uçuşları.",
    timesTitle: lang === 'en' ? "Transfer Durations" : "Transfer Süreleri",
    cat1: lang === 'en' ? "City & Surroundings" : "Şehir & Çevresi",
    cat2: lang === 'en' ? "East Antalya" : "Doğu Antalya",
    cat3: lang === 'en' ? "West Antalya" : "Batı Antalya",
    longDesc1: lang === 'en'
      ? "Our airport transfer services are carried out with latest model VIP vehicles at the most affordable prices. For 10 years, we have been meeting you at the airport with VIP vehicles and delivering you safely to your hotel or any point you desire. WiFi, TV, and cold beverage treats are always available in our vehicles."
      : "Havalimanı transfer hizmetlerimiz son model VIP araçlarla en uygun fiyatlara yapılmaktadır. 10 yıldır havalimanında sizi VIP araçla karşılar, otelinize veya istediğiniz herhangi bir noktaya güvenle ulaştırırız. Araçlarımızın içerisinde WiFi, TV ve soğuk içecek ikramlarımız her zaman mevcuttur.",
    longDesc2: lang === 'en'
      ? "Regardless of where your hotel is in Antalya, your journey begins as soon as you step off the plane. If you wish to take a city tour after your hotel check-in, you can travel VIP to any destination for a fee. Let your holiday start in the vehicle; baby seats are added upon request for our little guests."
      : "Oteliniz Antalya'nın neresinde olursa olsun uçaktan iner inmez yolculuğunuz başlar. Otelden sonra şehir turu yapmak isterseniz, ücret karşılığında istediğiniz yere VIP olarak seyahat edebilirsiniz. Tatiliniz araçtayken başlasın; bebek koltuğu talebiniz doğrultusunda aracınıza eklenir.",
    legal: lang === 'en' ? "Legal Guarantee" : "Yasal Güvence",
    wifi: lang === 'en' ? "Free WiFi" : "Ücretsiz WiFi",
    coffee: lang === 'en' ? "Cold Drinks" : "Soğuk İkram",
    fleet: lang === 'en' ? "Luxury Fleet" : "Lüks Filo",
    formTitle: lang === 'en' ? "CONTACT US!" : "BİZİMLE İLETİŞİME GEÇİN!",
    formDesc: lang === 'en' ? "To get a reservation and detailed information, please fill out the form below! We will call you as soon as possible." : "Rezervasyon ve detaylı bilgi almak için Lütfen aşağıdaki formu doldurarak bizimle iletişime geçin!",
    phName: lang === 'en' ? "Your Full Name" : "Adınız Soyadınız",
    phPhone: lang === 'en' ? "Your Phone Number" : "Telefon Numaranız",
    phEmail: lang === 'en' ? "Your Email Address" : "E-posta Adresiniz",
    paxLabel: lang === 'en' ? "PASSENGERS" : "YOLCU",
    paxValue: lang === 'en' ? `${adults} Adult, ${children} Child` : `${adults} Yetişkin, ${children} Çocuk`,
    adult: lang === 'en' ? "Adult" : "Yetişkin",
    child: lang === 'en' ? "Child" : "Çocuk",
    details: lang === 'en' ? "Flight Code, Hotel Name, and Baby Seat Request..." : "Uçuş Kodu, Otel Adı ve Bebek Koltuğu Talebi...",
    btnSend: lang === 'en' ? "SEND NOW" : "GÖNDER",
    btnSending: lang === 'en' ? "SENDING..." : "GÖNDERİLİYOR...",
    successMsg: lang === 'en' ? "Your request has been sent successfully. Thank you for contacting us. We will call you shortly." : "Talebiniz başarıyla gönderildi. Bizimle iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede sizi arayacağız."
  };

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

    const passengerCountText = `${adults} ${tStrings.adult}, ${children} ${tStrings.child}`;

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_type: 'Antalya Havalimanı VIP Transfer',
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

      <section className="relative pt-44 pb-16 overflow-hidden z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6">
          <div className="w-16 h-16 bg-white/60 border border-white rounded-[2rem] flex items-center justify-center text-gold mx-auto mb-6 shadow-lg">
            <Plane size={32} />
          </div>
          <span className="text-[10px] font-black text-gold tracking-[0.5em] uppercase mb-4 block italic">{tStrings.badge}</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-tight mb-6">
            {tStrings.title1} <br /> <span className="text-gold">{tStrings.title2}</span>
          </h1>
          <div className="h-1.5 w-24 bg-gold mx-auto rounded-full shadow-lg" />
        </motion.div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 xl:col-span-8 space-y-10">
              
              <div className="bg-white/40 backdrop-blur-md border border-white p-8 md:p-12 rounded-[3.5rem] shadow-xl space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black italic uppercase text-[#1a1a1a] tracking-tighter flex items-center gap-3">
                    <Info className="text-gold" /> {tStrings.generalInfo}
                  </h2>
                  <p className="text-gray-700 font-bold text-sm leading-relaxed text-justify opacity-90">
                    {tStrings.generalDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/50 p-6 rounded-3xl border border-white shadow-sm">
                    <h3 className="text-gold font-black text-xs uppercase tracking-widest mb-4">{tStrings.terminals}</h3>
                    <ul className="text-xs font-bold text-gray-600 space-y-2">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"/> {tStrings.t1}</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"/> {tStrings.t2}</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"/> {tStrings.dom}</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 p-6 rounded-3xl border border-white shadow-sm">
                    <h3 className="text-gold font-black text-xs uppercase tracking-widest mb-4">{tStrings.capacity}</h3>
                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
                      {tStrings.capacityDesc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-black italic uppercase text-[#1a1a1a] tracking-tighter flex items-center gap-3">
                    <Map className="text-gold" /> {tStrings.timesTitle}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TimeCard title={tStrings.cat1} items={[
                      {n: lang === 'en' ? "Center" : "Merkez", t: "20-25 min"},
                      {n: "Lara", t: "15-20 min"},
                      {n: "Konyaaltı", t: "25-30 min"}
                    ]} />
                    <TimeCard title={tStrings.cat2} items={[
                      {n: "Belek", t: "30-35 min"},
                      {n: "Side", t: "60 min"},
                      {n: "Alanya", t: "2-2.5 h"}
                    ]} />
                    <TimeCard title={tStrings.cat3} items={[
                      {n: "Kemer", t: "50-60 min"},
                      {n: "Göynük", t: "45-50 min"},
                      {n: "Kaş/Kalkan", t: "3-3.5 h"}
                    ]} />
                  </div>
                </div>

                <div className="space-y-6 text-gray-700 font-bold text-sm leading-relaxed text-justify opacity-90">
                  <p>{tStrings.longDesc1}</p>
                  <p>{tStrings.longDesc2}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FeatureSmall icon={ShieldCheck} t={tStrings.legal} />
                <FeatureSmall icon={Wifi} t={tStrings.wifi} />
                <FeatureSmall icon={Coffee} t={tStrings.coffee} />
                <FeatureSmall icon={Car} t={tStrings.fleet} />
              </div>

            </motion.div>

            <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 xl:col-span-4 space-y-8 lg:sticky lg:top-32">
              <div className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h4 className="text-[#1a1a1a] font-black text-2xl uppercase italic tracking-tighter mb-2 text-center">{tStrings.formTitle}</h4>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-8 leading-relaxed text-center opacity-80">
                  {tStrings.formDesc}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder={tStrings.phName} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] placeholder-gray-400 shadow-inner" />
                  <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder={tStrings.phPhone} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] shadow-inner" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder={tStrings.phEmail} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] shadow-inner" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative bg-cream border border-cream rounded-2xl focus-within:border-gold shadow-inner overflow-hidden">
                      <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="date" name="date" required min={today} value={formData.date} onChange={handleChange} className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] uppercase cursor-pointer" />
                    </div>
                    <div className="relative bg-cream border border-cream rounded-2xl focus-within:border-gold shadow-inner overflow-hidden">
                      <Timer size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full bg-transparent outline-none pl-12 pr-3 py-4.5 text-[10px] font-black text-[#1a1a1a] cursor-pointer" />
                    </div>
                  </div>

                  <div className="relative bg-cream border border-cream rounded-2xl shadow-inner" ref={passengerRef}>
                    <button type="button" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)} className="w-full flex items-center gap-4 px-5 py-4.5">
                      <Users size={18} className="text-gray-400" />
                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider block">{tStrings.paxLabel}</span>
                        <span className="text-[11px] font-bold text-gray-600 block leading-tight">{tStrings.paxValue}</span>
                      </div>
                      <ChevronRight size={16} className={`text-gold transition-transform ${showPassengerDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showPassengerDropdown && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white rounded-[2rem] p-6 shadow-2xl z-50 space-y-5">
                          <Counter title={tStrings.adult} value={adults} set={setAdults} min={1} />
                          <Counter title={tStrings.child} value={children} set={setChildren} min={0} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <textarea name="details" required rows={3} value={formData.details} onChange={handleChange} placeholder={tStrings.details} className="w-full bg-cream border border-cream focus:border-gold outline-none px-5 py-4.5 rounded-2xl text-xs font-black text-[#1a1a1a] shadow-inner resize-none" />
                  
                  <button type="submit" disabled={isSubmitting} className="bg-[#1a1a1a] hover:bg-gold text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 w-full flex items-center justify-center gap-3">
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

function TimeCard({ title, items }: { title: string, items: {n: string, t: string}[] }) {
  return (
    <div className="bg-white/60 border border-white p-5 rounded-[2.5rem] shadow-sm">
      <h4 className="text-gold font-black text-[10px] uppercase tracking-widest mb-4 border-b border-gold/10 pb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="flex justify-between items-center text-[11px] font-bold text-[#1a1a1a]">
            <span>{i.n}</span>
            <span className="text-gold italic">{i.t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureSmall({ icon: Icon, t }: { icon: any, t: string }) {
  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm text-center">
      <Icon size={20} className="text-gold" />
      <span className="text-[9px] font-black text-[#1a1a1a] uppercase tracking-tighter">{t}</span>
    </div>
  );
}

function Counter({ title, value, set, min }: { title: string, value: number, set: any, min: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-black uppercase text-[#1a1a1a]">{title}</span>
      <div className="flex items-center gap-4 bg-cream p-1.5 rounded-full border border-cream-dark">
        <button type="button" onClick={() => set(Math.max(min, value - 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm disabled:opacity-30" disabled={value <= min}><Minus size={14} /></button>
        <span className="text-sm font-black text-[#1a1a1a] w-6 text-center">{value}</span>
        <button type="button" onClick={() => set(value + 1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm" disabled={value >= 12}><Plus size={14} /></button>
      </div>
    </div>
  );
}