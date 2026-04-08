"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/context/LanguageContext';

const policiesData = {
  tr: [
    { title: "GENEL HÜKÜMLER", content: "Xrem Transfer, tüm transfer hizmetlerini yasal mevzuatlara uygun, belgeli ve sigortalı araçlarla gerçekleştirmektedir. Hizmet alan tüm yolcularımız, seyahat süresince koltuk sigortası ve genel trafik sigortası güvencesi altındadır." },
    { title: "REZERVASYON VE ONAY", content: "Rezervasyonlar, web sitesi üzerinden veya çağrı merkezi aracılığıyla yapılmaktadır. Yapılan rezervasyonlar, tarafınıza PNR kodu içeren bir konfirme mesajı veya e-posta iletilmesiyle geçerlilik kazanır. Uçuş saatlerindeki değişiklikler yolcu tarafından bildirilmelidir." },
    { title: "BEKLEME SÜRELERİ", content: "Havalimanı karşılamalarında, uçağınızın inişinden itibaren 60 dakika bekleme süresi ücretsizdir. Otel veya adresten alımlarda bekleme süresi 15 dakika ile sınırlıdır. Bu süreleri aşan durumlarda şoförümüz veya operasyon merkezimiz sizinle iletişime geçmeye çalışacaktır." },
    { title: "İPTAL VE İADE KOŞULLARI", content: "Transfer saatine 24 saat kalaya kadar yapılan iptallerde ödemenin tamamı iade edilir. 24 saatten az, 12 saatten fazla kalan sürelerdeki iptallerde %50 kesinti uygulanır. 12 saatten az kalan sürelerde veya araç adrese ulaştıktan sonra yapılan iptallerde iade yapılmamaktadır." },
    { title: "BAGAJ POLİTİKASI", content: "Her yolcunun bir adet standart valiz ve bir adet el bagajı hakkı bulunmaktadır. Bebek arabası, tekerlekli sandalye veya spor ekipmanları (golf çantası, kayak takımı vb.) rezervasyon esnasında mutlaka bildirilmelidir. Bildirilmeyen aşırı bagajlar kapasite aşımına neden olursa ek araç gerekebilir." },
    { title: "ARAÇ İÇİ KURALLAR", content: "T.C. yasaları gereği araçlarımızın içerisinde sigara ve tütün mamullerinin tüketilmesi kesinlikle yasaktır. Yolcuların araç içerisinde alkol tüketmesi ve araç güvenliğini tehlikeye atacak davranışlarda bulunması durumunda şoför transferi sonlandırma yetkisine sahiptir." },
    { title: "EVCİL HAYVAN TAŞIMA", content: "Evcil hayvanlar, yalnızca kafes içerisinde ve rezervasyon aşamasında bilgi verilmesi şartıyla taşınabilmektedir. Kafes dışındaki evcil hayvanlar, araç döşemelerine zarar verebileceği ve alerjik durumlar oluşturabileceği için kabul edilmemektedir." },
    { title: "YOLCU SORUMLULUKLARI", content: "Yolcular, transfer saatinde belirlenen noktada hazır bulunmakla yükümlüdür. Araç içerisindeki kişisel eşyaların unutulması durumunda Xrem Transfer sorumluluk kabul etmez, ancak unutulan eşyanın bulunması durumunda yolcuya ulaştırılması için azami gayret gösterilir." }
  ],
  en: [
    { title: "GENERAL PROVISIONS", content: "Xrem Transfer performs all transfer services with certified and insured vehicles in accordance with legal regulations. All passengers receiving service are under the guarantee of seat insurance and general traffic insurance during the journey." },
    { title: "RESERVATION AND CONFIRMATION", content: "Reservations are made via the website or through the call center. Reservations made become valid upon the delivery of a confirmation message or email containing a PNR code. Changes in flight times must be notified by the passenger." },
    { title: "WAITING TIMES", content: "For airport pick-ups, a waiting time of 60 minutes from your plane's landing is free of charge. For pick-ups from a hotel or address, the waiting time is limited to 15 minutes. In cases exceeding these periods, our driver or operation center will try to contact you." },
    { title: "CANCELLATION AND REFUND CONDITIONS", content: "For cancellations made up to 24 hours before the transfer time, the entire payment is refunded. A 50% deduction is applied for cancellations made less than 24 hours and more than 12 hours. No refund is made for cancellations made less than 12 hours or after the vehicle arrives at the address." },
    { title: "LUGGAGE POLICY", content: "Every passenger has the right to one standard suitcase and one hand luggage. Strollers, wheelchairs, or sports equipment (golf bags, ski gear, etc.) must be reported during reservation. If unreported excess luggage causes capacity limits to be exceeded, an additional vehicle may be required." },
    { title: "IN-VEHICLE RULES", content: "In accordance with the laws of the Republic of Turkey, the consumption of cigarettes and tobacco products inside our vehicles is strictly prohibited. In the event that passengers consume alcohol in the vehicle and engage in behaviors that endanger vehicle safety, the driver has the authority to terminate the transfer." },
    { title: "PET TRANSPORTATION", content: "Pets can only be transported in a cage and provided that information is given during the reservation stage. Pets outside the cage are not accepted as they may damage vehicle upholstery and create allergic situations." },
    { title: "PASSENGER RESPONSIBILITIES", content: "Passengers are obliged to be present at the designated point at the transfer time. Xrem Transfer does not accept responsibility in case personal belongings are forgotten in the vehicle, but maximum effort is shown to deliver the forgotten item to the passenger if found." }
  ]
};

export default function YolcuTasimaPolitikası() {
  const { lang } = useLanguage();
  const currentPolicies = lang === 'en' ? policiesData.en : policiesData.tr;

  const tStrings = {
    title1: lang === 'en' ? "PASSENGER TRANSPORT" : "YOLCU TAŞIMA",
    title2: lang === 'en' ? "POLICY" : "POLİTİKASI",
    subtitle: lang === 'en' ? "XREMTRANSFER | OFFICIAL SERVICE AND SECURITY TERMS" : "XREMTRANSFER | RESMİ HİZMET VE GÜVENLİK ŞARTLARI",
    footerText1: lang === 'en' ? "This policy text is issued by" : "Bu politika metni yolcu güvenliği ve hizmet kalitesi standartları gereği",
    footerText2: lang === 'en' ? "XREM TOURISM TRANSPORTATION LTD. STI." : "XREM TURİZM TAŞIMACILIK LTD. ŞTİ.",
    footerText3: lang === 'en' ? "in accordance with passenger safety and service quality standards." : "tarafından düzenlenmiştir."
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img src="/how-it-works/hizli-rezervasyon.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/80 to-cream/85 backdrop-blur-[1px]" />
      </div>

      <section className="relative pt-44 pb-24 overflow-hidden text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 relative z-10"
        >
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 text-[#1a1a1a]">
            {tStrings.title1} <br /> <span className="text-gold">{tStrings.title2}</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-[12px] tracking-[0.8em] uppercase font-black opacity-80">
            {tStrings.subtitle}
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentPolicies.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/40 backdrop-blur-md border border-white p-10 rounded-[3rem] hover:border-gold hover:shadow-[0_10px_40px_rgba(191,149,63,0.2)] shadow-lg transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[2px] bg-gold group-hover:w-12 transition-all duration-500 rounded-full" />
                  <h2 className="text-xl font-black italic uppercase tracking-widest text-gold/90 group-hover:text-gold transition-colors">
                    {item.title}
                  </h2>
                </div>
                <p className="text-[#1a1a1a] opacity-80 leading-relaxed font-bold italic text-sm text-justify group-hover:opacity-100 transition-opacity">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto border-t border-cream-dark pt-16">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.4em] italic mb-4">
            {tStrings.footerText1} <br />
            <span className="text-[#1a1a1a] text-xs">{tStrings.footerText2}</span> {tStrings.footerText3}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}