"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Anchor, Users, Navigation, Star, ShieldCheck, Waves, CheckCircle2, ArrowRight, Utensils, Compass, ChevronLeft, ChevronRight } from "lucide-react";

export default function YachtRentalPage() {
  const { lang } = useLanguage();
  const [currentImg, setCurrentImg] = useState(0);

  const yachtImages = [
    "/xrem-aqua/xrem-aqua-3.jpeg",
    "/xrem-aqua/xrem-aqua-4.jpeg",
    "/xrem-aqua/xrem-aqua-5.jpeg",
    "/xrem-aqua/xrem-aqua-6.jpeg"
  ];

  const tStrings = {
    badge: "XREM PREMIUM YACHTING",
    title1: lang === 'en' ? "VIP YACHT" : "VIP YAT",
    title2: lang === 'en' ? "CHARTER" : "KİRALAMA",
    heroDesc: lang === 'en' 
      ? "Experience the comfort of a five-star hotel on the sea with our luxury yacht specially allocated for you in the unique bays of Antalya." 
      : "Antalya'nın eşsiz koylarında, tamamen size özel tahsis edilmiş lüks yatımızla deniz üzerindeki beş yıldızlı otel konforunu yaşayın.",
    assuranceLabel: lang === 'en' ? "ASSURANCE" : "GÜVENCE",
    assuranceValue: lang === 'en' ? "FULLY INSURED SECURITY" : "TAM SİGORTALI GÜVENLİK",
    sectionTitle1: lang === 'en' ? "A PRIVILEGED DAY" : "AYRICALIKLI BİR GÜN",
    sectionTitle2: lang === 'en' ? "YOUR PALACE" : "DENİZ ÜZERİNDEKİ",
    sectionTitle3: lang === 'en' ? "ON THE SEA" : "SARAYINIZ",
    sectionDesc: lang === 'en'
      ? "Spend an unforgettable day in the most pristine bays of the Mediterranean, far from the crowds, with our luxury yacht allocated exclusively for you and your loved ones. Every detail has been thought out for you in this unique experience, where you are picked up from your hotel by our VIP vehicles and dropped back at the end of the tour."
      : "Sadece size ve sevdiklerinize özel tahsis edilen lüks yatımızla, kalabalıktan uzak, Akdeniz'in en bakir koylarında unutulmaz bir gün geçirin. Otelinizden VIP araçlarımızla alınıp, tur bitiminde tekrar otelinize bırakıldığınız bu eşsiz deneyimde her detay sizin için düşünüldü.",
    includedTitle: lang === 'en' ? "SERVICES INCLUDED IN THE PRICE" : "ÜCRETE DAHİL OLAN HİZMETLER",
    bookBtn: lang === 'en' ? "BOOK NOW" : "HEMEN REZERVASYON YAPIN",
    ctaTitle1: lang === 'en' ? "FOR SPECIAL ROUTES" : "ÖZEL ROTALAR VE",
    ctaTitle2: lang === 'en' ? "AND REQUESTS" : "TALEPLERİNİZ İÇİN",
    ctaDesc: lang === 'en'
      ? "We can organize our yacht as you wish for marriage proposals, birthday parties, special celebrations, or sunset tours. Contact our team for special menu and concept requests."
      : "Evlilik teklifi, doğum günü partisi, özel kutlamalar veya gün batımı turları için yatımızı dilediğiniz gibi organize edebiliriz. Özel menü ve konsept istekleriniz için ekibimizle iletişime geçin.",
    planBtn: lang === 'en' ? "PLAN SPECIAL TOUR" : "ÖZEL TUR PLANLA",
    waMsg: lang === 'en' 
      ? "Hello, I would like to get information and a quote about your VIP Yacht Charter service." 
      : "Merhaba, VIP Yat Kiralama hizmetiniz hakkında bilgi ve fiyat almak istiyorum."
  };

  const features = [
    { icon: <Users size={24} />, title: lang === 'en' ? "CAPACITY" : "KAPASİTE", value: lang === 'en' ? "1-12 PEOPLE" : "1-12 KİŞİ" },
    { icon: <Navigation size={24} />, title: lang === 'en' ? "LENGTH" : "UZUNLUK", value: lang === 'en' ? "24 METERS" : "24 METRE" },
    { icon: <Star size={24} />, title: lang === 'en' ? "CABIN" : "KABİN", value: lang === 'en' ? "3 MASTER CABINS" : "3 MASTER KABİN" },
    { icon: <Utensils size={24} />, title: lang === 'en' ? "SERVICE" : "HİZMET", value: lang === 'en' ? "PRIVATE CHEF" : "ÖZEL AŞÇI" },
  ];

  const includes = lang === 'en' ? [
    "Round-trip transfer from your hotel by VIP vehicle",
    "Rich menu prepared by a Private Chef",
    "Unlimited local soft drinks and snacks",
    "Professional Captain and Crew service",
    "Snorkel, fins, and various sea toys",
    "Fuel, port taxes, and insurance"
  ] : [
    "VIP Araç ile Otelinizden Çift Yönlü Transfer",
    "Özel Aşçı Tarafından Hazırlanan Zengin Menü",
    "Limitsiz Yerli Soft İçecekler ve Atıştırmalıklar",
    "Profesyonel Kaptan ve Mürettebat Hizmeti",
    "Şnorkel, Palet ve Çeşitli Deniz Oyuncakları",
    "Yakıt, Liman Vergileri ve Sigorta"
  ];

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % yachtImages.length);
  const prevImg = () => setCurrentImg((prev) => (prev === 0 ? yachtImages.length - 1 : prev - 1));

  const handleWhatsApp = () => {
    window.open(`https://wa.me/905322855572?text=${encodeURIComponent(tStrings.waMsg)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/xrem-aqua/xrem-aqua-2.jpeg" 
            alt="VIP Yacht Rental" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-cream" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Anchor size={20} className="text-gold" />
              <span className="text-[11px] font-black text-white tracking-[0.5em] uppercase">{tStrings.badge}</span>
              <Anchor size={20} className="text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-6 drop-shadow-2xl">
              {tStrings.title1} <span className="text-gold">{tStrings.title2}</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-200 font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
              {tStrings.heroDesc}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative z-20 -mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="w-14 h-14 bg-cream-dark text-gold rounded-full flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">{feature.title}</span>
                <span className="text-sm font-black text-luxury-dark uppercase tracking-tight">{feature.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gold/10 rounded-[3rem] blur-2xl transform rotate-3" />
                
                <div className="relative rounded-[3rem] overflow-hidden border border-white shadow-2xl bg-cream-dark h-[500px] group">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImg}
                      src={yachtImages[currentImg]}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      alt="Yacht Details" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                  <button 
                    onClick={prevImg} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-gold text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button 
                    onClick={nextImg} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-gold text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {yachtImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImg(idx)}
                        className={`transition-all duration-300 rounded-full ${currentImg === idx ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-cream-dark z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{tStrings.assuranceLabel}</span>
                      <span className="block text-sm font-black text-luxury-dark uppercase tracking-tight">{tStrings.assuranceValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div>
                <span className="text-[10px] font-black text-gold tracking-[0.4em] uppercase mb-4 block border-l-4 border-gold pl-4">{tStrings.sectionTitle1}</span>
                <h2 className="text-3xl md:text-5xl font-black text-luxury-dark uppercase tracking-tighter italic leading-none mb-6">
                  {tStrings.sectionTitle2} <br /> <span className="text-gold">{tStrings.sectionTitle3}</span>
                </h2>
                <p className="text-sm text-luxury-gray font-medium leading-relaxed uppercase tracking-wider">
                  {tStrings.sectionDesc}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-cream-dark">
                <h3 className="text-[11px] font-black text-luxury-dark uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Star size={16} className="text-gold fill-gold" /> {tStrings.includedTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[10px] font-bold text-luxury-gray uppercase tracking-widest leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={handleWhatsApp}
                  className="bg-luxury-dark hover:bg-gold text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-3 group"
                >
                  <Compass size={20} className="group-hover:animate-spin-slow" />
                  {tStrings.bookBtn} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-luxury-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/how-it-works/hizli-rezervasyon.jpeg')] bg-cover bg-center mix-blend-luminosity" />
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Waves size={48} className="text-gold mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-6">
            {tStrings.ctaTitle1} <span className="text-gold">{tStrings.ctaTitle2}</span>
          </h2>
          <p className="text-sm text-gray-400 font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed mb-10">
            {tStrings.ctaDesc}
          </p>
          <button 
            onClick={handleWhatsApp}
            className="bg-gold hover:bg-white text-luxury-dark px-12 py-5 rounded-full font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95 inline-flex items-center gap-3"
          >
            {tStrings.planBtn} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}