"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRIVACY_SECTIONS = [
  {
    title: "GİZLİLİK TAAHHÜDÜ",
    content: "Xrem Transfer olarak, misafirlerimizin kişisel verilerinin korunması ve gizliliği saniyeler içinde en öncelikli lojistik görevimizdir. İşbu Gizlilik Sözleşmesi, tarafımıza sağladığınız bilgilerin hangi amaçla toplandığını ve nasıl korunduğunu saniyeler içinde mühür altına almaktadır."
  },
  {
    title: "TOPLANAN KİŞİSEL VERİLER",
    content: "Rezervasyon sürecinde saniyeler içinde paylaştığınız; Ad, Soyad, T.C. Kimlik No, Telefon, E-posta adresi, uçuş bilgileri ve transfer güzergahı gibi veriler, sadece hizmet kalitemizi mühürlemek ve yasal zorunlulukları yerine getirmek amacıyla toplanır."
  },
  {
    title: "VERİLERİN KULLANIM AMACI",
    content: "Kişisel verileriniz; rezervasyonunuzun doğrulanması, transfer operasyonunun saniyeler içinde planlanması, ödeme işlemlerinin güvenli mühürlenmesi ve sizlere seyahat süreciyle ilgili bilgilendirme yapılması (SMS/E-posta) amacıyla kullanılır."
  },
  {
    title: "VERİ GÜVENLİĞİ VE ŞİFRELEME",
    content: "Bilgisayar sistemlerimizde toplanan tüm veriler saniyeler içinde SSL şifreleme yöntemleri ve modern güvenlik duvarları ile korunmaktadır. Ödeme bilgileriniz (kredi kartı verileri) sistemlerimizde saklanmaz, direkt olarak güvenli banka altyapısına mühürlenir."
  },
  {
    title: "ÜÇÜNCÜ ŞAHISLARLA PAYLAŞIM",
    content: "Kişisel verileriniz, yasal mercilerin talepleri veya transfer hizmetinin ifası için gerekli olan operasyonel ortaklar (şoför ve saha ekibi) dışında, hiçbir ticari amaçla üçüncü şahıslara saniyeler içinde satılmaz veya kiralanmaz."
  },
  {
    title: "ÇEREZ (COOKIE) POLİTİKASI",
    content: "Web sitemiz, kullanıcı deneyimini saniyeler içinde iyileştirmek için çerezler kullanmaktadır. Çerezler, sitenin işlevselliğini artırmak ve tercihlerini saniyeler içinde hatırlamak için kullanılan teknik verilerdir."
  },
  {
    title: "HAKLARINIZ VE GÜNCELLEME",
    content: "6698 sayılı KVKK kapsamında, sistemimizde kayıtlı verilerinize saniyeler içinde erişme, bunları güncelleme veya silme hakkına sahipsiniz. Taleplerinizi operasyon merkezimize ileterek verilerinizi saniyeler içinde mühür altına alabilir veya sildirebilirsiniz."
  }
];

export default function GizlilikPage() {
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

      <section className="relative pt-44 pb-24 overflow-hidden text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 relative z-10"
        >
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 text-[#1a1a1a]">
            GİZLİLİK VE <br /> <span className="text-gold font-black">GÜVENLİK SÖZLEŞMESİ</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-[12px] tracking-[0.8em] uppercase font-black opacity-80">
            XREMTRANSFER | GİZLİLİK & GÜVENLİK
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {PRIVACY_SECTIONS.map((section, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/40 backdrop-blur-md border border-white p-8 md:p-12 rounded-[3.5rem] hover:border-gold hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] shadow-lg transition-all duration-500 group"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-1 h-12 bg-gold rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500" />
                  <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-widest text-gold/90 group-hover:text-gold transition-colors">
                    {section.title}
                  </h2>
                </div>
                <p className="text-[#1a1a1a] opacity-80 leading-relaxed font-bold italic text-sm md:text-base text-justify group-hover:opacity-100 transition-opacity">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto border-t border-cream-dark pt-16">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.5em] italic mb-4">
            BU SÖZLEŞME,  <br /> 
             <span className="text-[#1a1a1a]">XREM TURİZM LTD. ŞTİ.</span> TARAFINDAN DÜZENLENMİŞTİR.
          </p>
          <div className="mt-8 opacity-20 flex justify-center grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <img src="/logo.png" alt="XREM VIP" className="h-12" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}