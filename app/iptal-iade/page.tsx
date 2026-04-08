"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';

const refundData = {
  tr: [
    { title: "TAM İADE KOŞULLARI", content: "Transfer saatinize 24 saat ve daha fazla süre kala yapılan iptal taleplerinde, ödemiş olduğunuz tutarın tamamı saniyeler içinde iade süreci kapsamına alınır. Lojistik planlamanın henüz kesinleşmediği bu aşamada hiçbir kesinti yapılmadan mühürleme iptal edilir." },
    { title: "%50 İADE DURUMU", content: "Transfer saatinize 24 saatten az, 12 saatten fazla süre kalan durumlarda yapılan iptallerde, operasyonel hazırlıkların başlaması nedeniyle toplam tutarın %50'si tutarında bir kesinti uygulanır. Kalan tutar saniyeler içinde hesabınıza mühürlenir." },
    { title: "İADE YAPILMAYAN DURUMLAR", content: "Transfer saatinize 12 saatten az süre kala yapılan iptallerde veya aracın adrese ulaşmasından sonra gerçekleşen 'No-Show' (bulunmama) durumlarında iade yapılmamaktadır. Lojistik hattımız o saat dilimi için saniyeler içinde size rezerve edildiğinden bu kural mühürlenmiştir." },
    { title: "UÇUŞ GECİKMELERİ VE DEĞİŞİKLİKLER", content: "Uçuşlarınızda meydana gelen rötarlar saniyeler içinde operasyon merkezimiz tarafından takip edilir. Havalimanı inişli transferlerde uçuş rötarı nedeniyle yaşanan gecikmelerde hiçbir ek ücret talep edilmez ve iade hakkınız sarsıntısız bir şekilde korunur." },
    { title: "İADE SÜRECİ VE GERİ ÖDEME", content: "Onaylanan iadeler, ödeme yapmış olduğunuz banka kartına veya kredi kartına saniyeler içinde talimatlandırılarak gönderilir. Banka sistemlerine bağlı olarak iadenin hesabınıza yansıması saniyeler içinde değil, bankanızın prosedürlerine göre 3-7 iş günü sürebilir." },
    { title: "MÜCBİR SEBEPLER", content: "Doğal afetler, havayolu şirketlerinin uçuş iptalleri veya resmi makamlarca alınan kısıtlama kararları gibi kontrol dışı durumlarda; iptal/iade şartları lojistik ekibimizce saniyeler içinde esnetilerek misafir lehine mühürlenir." }
  ],
  en: [
    { title: "FULL REFUND CONDITIONS", content: "For cancellation requests made 24 hours or more before your transfer time, the entire amount paid will be included in the refund process. At this stage, where logistics planning is not yet finalized, the reservation is cancelled without any deduction." },
    { title: "50% REFUND SITUATION", content: "For cancellations made less than 24 hours but more than 12 hours before your transfer time, a 50% deduction will be applied due to the start of operational preparations. The remaining amount will be refunded to your account." },
    { title: "NON-REFUNDABLE SITUATIONS", content: "No refunds are made for cancellations made less than 12 hours before your transfer time or in 'No-Show' situations after the vehicle arrives at the address. This rule is sealed as our logistics line is reserved for you for that time slot." },
    { title: "FLIGHT DELAYS AND CHANGES", content: "Delays in your flights are tracked by our operation center. No extra fee is charged for delays caused by flight delays in airport landing transfers, and your refund rights are protected." },
    { title: "REFUND PROCESS AND REPAYMENT", content: "Approved refunds are instructed and sent to the debit or credit card you used for payment. Depending on banking systems, the refund may take 3-7 business days to reflect in your account according to your bank's procedures." },
    { title: "FORCE MAJEURE", content: "In out-of-control situations such as natural disasters, airline flight cancellations, or restriction decisions taken by official authorities; cancellation/refund conditions are stretched by our logistics team in favor of the guest." }
  ]
};

export default function IptalIadePage() {
  const { lang } = useLanguage();
  const currentPolicies = lang === 'en' ? refundData.en : refundData.tr;

  const tStrings = {
    title1: lang === 'en' ? "CANCELLATION &" : "İPTAL VE",
    title2: lang === 'en' ? "REFUND CONDITIONS" : "İADE KOŞULLARI",
    subtitle: lang === 'en' ? "XREMTRANSFER | REFUND & CANCELLATION CONDITIONS" : "XREMTRANSFER | İADE KOŞULLARI VE İPTAL",
    supportTitle: lang === 'en' ? "SUPPORT LINE" : "DESTEK HATTI",
    supportDesc: lang === 'en' ? "For your cancellation and refund requests to be processed in seconds" : "İptal ve iade talepleriniz saniyeler içinde işleme alınması için"
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPolicies.map((policy, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/40 backdrop-blur-md border border-white p-10 rounded-[3.5rem] hover:border-gold hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] shadow-lg transition-all duration-500 relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold transition-all duration-500">
                  <span className="text-gold group-hover:text-white font-black italic transition-colors duration-500">{index + 1}</span>
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-widest text-[#1a1a1a] mb-4 group-hover:text-gold transition-colors">
                  {policy.title}
                </h2>
                <p className="text-gray-600 leading-relaxed font-bold italic text-xs md:text-sm text-justify opacity-80 group-hover:opacity-100 transition-opacity">
                  {policy.content}
                </p>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gold group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto bg-gold p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
          <h3 className="text-2xl font-black italic uppercase mb-4 relative z-10">{tStrings.supportTitle}</h3>
          <p className="text-sm font-bold uppercase tracking-wider relative z-10">
            {tStrings.supportDesc} <br />
            <a href="mailto:operasyon@xremtransfer.com" className="text-2xl md:text-3xl block mt-4 font-black text-[#1a1a1a] hover:text-white transition-colors">operasyon@xremtransfer.com</a>
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </section>

      <Footer />
    </main>
  );
}