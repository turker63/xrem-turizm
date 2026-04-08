"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';

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

export default function KVKKPage() {
  const { lang } = useLanguage();
  const currentSections = lang === 'en' ? kvkkData.en : kvkkData.tr;

  const tStrings = {
    title1: lang === 'en' ? "KVKK" : "KVKK",
    title2: lang === 'en' ? "CLARIFICATION TEXT" : "AYDINLATMA METNİ",
    subtitle: lang === 'en' ? "XREMTRANSFER | DATA PRIVACY AND LEGAL PROCEDURES" : "XREMTRANSFER | VERİ GİZLİLİĞİ VE HUKUKİ İŞLEMLER",
    footerText: lang === 'en' ? "CONTACT US FOR YOUR KVKK REQUESTS:" : "KVKK TALEPLERİNİZ İÇİN SANIYELER İÇİNDE BİZE ULAŞIN:"
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/80 to-cream/95 backdrop-blur-[1px]" />
      </div>

      <section className="relative pt-44 pb-24 overflow-hidden text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 relative z-10"
        >
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 text-[#1a1a1a]">
            {tStrings.title1} <span className="text-gold">{tStrings.title2}</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-[12px] tracking-[0.8em] uppercase font-black opacity-80">
            {tStrings.subtitle}
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {currentSections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/40 backdrop-blur-md border border-white p-10 md:p-14 rounded-[4rem] hover:border-gold hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] shadow-lg transition-all duration-500"
            >
              <div className="flex items-start gap-8">
                <div className="text-gold font-black italic text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-widest text-[#1a1a1a] group-hover:text-gold transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed font-bold italic text-sm md:text-base text-justify opacity-80 group-hover:opacity-100 transition-opacity">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto border-t border-cream-dark pt-16">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.4em] italic mb-12">
            {tStrings.footerText} <br />
            <a href="mailto:info@xremtransfer.com" className="text-[#1a1a1a] text-xs hover:text-gold transition-colors">info@xremtransfer.com</a>
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="p-4 bg-white/60 border border-white rounded-2xl flex items-center justify-center font-black italic text-[#1a1a1a] shadow-sm">6698</div>
            <div className="p-4 bg-white/60 border border-white rounded-2xl flex items-center justify-center font-black italic text-[#1a1a1a] shadow-sm">SSL</div>
            <div className="p-4 bg-white/60 border border-white rounded-2xl flex items-center justify-center font-black italic text-gold shadow-sm">VIP</div>
            <div className="p-4 bg-white/60 border border-white rounded-2xl flex items-center justify-center font-black italic text-[#1a1a1a] shadow-sm">XREM</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}