"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqsData = {
  tr: [
    { q: "Transferime hangi araç gelecek?", a: "Rezervasyon esnasında belirlediğiniz kişi sayısı veya talebinize göre belirleyeceğiniz araç, transfer saatinde sizleri yerinde bekliyor olacaktır." },
    { q: "Transferim için fatura alabilir miyim?", a: "Tabii ki. Transfer ücretinizin faturasını, bizimle irtibata geçerek fatura bilgilerinizi paylaştığınızda, muhasebe departmanımız size en kısa sürede adresinize gönderecektir." },
    { q: "Transferimi iptal edebilir ya da değişiklik yapabilir miyim?", a: "Transfer ücretinizi banka havale/EFT yolu ile ödemiş ve transferinizi belirtilen şartlarda iptal etmişseniz, bize belirteceğiniz banka hesap numaralarına toplam transfer ücretiniz iade edilir." },
    { q: "Acil transfer ihtiyacında ne yapmalıyım?", a: "Bize telefonla ulaşarak transfer talebinizi anlık olarak bildirebilirsiniz." },
    { q: "Transfer hizmeti sadece tek yön mü? Dönüş transferi de yapıyor musunuz?", a: "İster otelde, ister yazlıkta, ister başka bir yerde konaklayın; havalimanına ulaşımınız için bize vereceğiniz adresten havalimanına dönüş transferinizi de yapmaktayız." },
    { q: "Araçlarınızda bebek koltuğu bulunuyor mu?", a: "Tüm araçlarımızda talep edildiği takdirde 1 adet bebek koltuğu ücretsiz olarak bulundurulmaktadır." },
    { q: "Havalimanında sizi nasıl bulacağım?", a: "Sizi havalimanı terminal çıkışında isminizin yazılı olduğu karşılama tabelamız ile karşılıyoruz. Kalabalık esnasında tabelamızı görememeniz durumunda bizi aradığınız takdirde, sizi şoför arkadaşımızla buluşacağınız noktaya yönlendiriyoruz." }
  ],
  en: [
    { q: "Which vehicle will come for my transfer?", a: "Depending on the number of people you specified during reservation or your specific request, your designated vehicle will be waiting for you on time." },
    { q: "Can I get an invoice for my transfer?", a: "Of course. When you share your billing details with us, our accounting department will send the invoice for your transfer fee to your address as soon as possible." },
    { q: "Can I cancel or change my transfer?", a: "If you have paid your transfer fee via wire transfer/EFT and canceled your transfer under the specified conditions, your total transfer fee will be refunded to the bank accounts you provide us." },
    { q: "What should I do for an urgent transfer need?", a: "You can reach us by phone to report your transfer request instantly." },
    { q: "Is the transfer service only one-way? Do you also do return transfers?", a: "Whether you stay in a hotel, a summer house, or elsewhere; we also provide return transfers from the address you provide to the airport." },
    { q: "Do your vehicles have baby seats?", a: "1 baby seat is provided free of charge in all our vehicles upon request." },
    { q: "How will I find you at the airport?", a: "We greet you at the airport terminal exit with our welcome sign bearing your name. If you cannot see our sign in the crowd, please call us, and we will direct you to the meeting point with our driver." }
  ]
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const { t, lang } = useLanguage();

  const currentFaqs = lang === 'en' ? faqsData.en : faqsData.tr;

  return (
    <section className="py-20 md:py-32 bg-cream-dark relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-2xl border border-cream-dark text-gold shadow-sm">
              <MessageCircleQuestion size={32} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-luxury-dark">
            {t.faqTitle1} <span className="text-gold">{t.faqTitle2}</span>
          </h3>
          <p className="text-luxury-gray/70 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-4">
            {t.faqSubtitle}
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {currentFaqs.map((f, i) => {
            const isOpen = activeIndex === i;

            return (
              <motion.div 
                key={i}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-white border-gold shadow-[0_15px_40px_rgba(191,149,63,0.15)]" 
                    : "bg-cream border-cream-dark hover:border-gold/30 hover:bg-white"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                >
                  <span className={`text-sm md:text-base font-black tracking-wide pr-4 transition-colors ${
                    isOpen ? "text-gold" : "text-luxury-dark group-hover:text-gold"
                  }`}>
                    {f.q}
                  </span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                      isOpen ? "bg-gold text-white border-gold shadow-md" : "bg-white text-luxury-gray/50 border-cream-dark group-hover:border-gold/30 group-hover:text-gold"
                    }`}
                  >
                    <ChevronDown size={16} strokeWidth={3} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-[13px] md:text-sm text-luxury-gray font-bold leading-relaxed border-t border-cream-dark/50 pt-5">
                        <div className="border-l-[3px] border-gold pl-5 py-1">
                          {f.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}