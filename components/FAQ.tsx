import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  { 
    q: "Transferime hangi araç gelecek?", 
    a: "Rezervasyon esnasında belirlediğiniz kişi sayısı veya talebinize göre belirleyeceğiniz araç, transfer saatinde sizleri yerinde bekliyor olacaktır." 
  },
  { 
    q: "Transferim için fatura alabilir miyim?", 
    a: "Tabii ki. Transfer ücretinizin faturasını, bizimle irtibata geçerek fatura bilgilerinizi paylaştığınızda, muhasebe departmanımız size en kısa sürede adresinize gönderecektir." 
  },
  { 
    q: "Transferimi iptal edebilir ya da değişiklik yapabilir miyim?", 
    a: "Transfer ücretinizi banka havale/EFT yolu ile ödemiş ve transferinizi belirtilen şartlarda iptal etmişseniz, bize belirteceğiniz banka hesap numaralarına toplam transfer ücretiniz iade edilir." 
  },
  { 
    q: "Acil transfer ihtiyacında ne yapmalıyım?", 
    a: "Bize telefonla ulaşarak transfer talebinizi anlık olarak bildirebilirsiniz." 
  },
  { 
    q: "Transfer hizmeti sadece tek yön mü? Dönüş transferi de yapıyor musunuz?", 
    a: "İster otelde, ister yazlıkta, ister başka bir yerde konaklayın; havalimanına ulaşımınız için bize vereceğiniz adresten havalimanına dönüş transferinizi de yapmaktayız." 
  },
  { 
    q: "Araçlarınızda bebek koltuğu bulunuyor mu?", 
    a: "Tüm araçlarımızda talep edildiği takdirde 1 adet bebek koltuğu ücretsiz olarak bulundurulmaktadır." 
  },
  { 
    q: "Havalimanında sizi nasıl bulacağım?", 
    a: "Sizi havalimanı terminal çıkışında isminizin yazılı olduğu karşılama tabelamız ile karşılıyoruz. Kalabalık esnasında tabelamızı görememeniz durumunda bizi aradığınız takdirde, sizi şoför arkadaşımızla buluşacağınız noktaya yönlendiriyoruz." 
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

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
            MERAK <span className="text-gold">EDİLENLER</span>
          </h3>
          <p className="text-luxury-gray/70 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-4">
            Aklınızdaki Tüm Soruların Cevapları
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {faqs.map((f, i) => {
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