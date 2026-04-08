"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const POLICIES = [
  {
    title: "GENEL HÜKÜMLER",
    content: "Xrem Transfer, tüm transfer hizmetlerini yasal mevzuatlara uygun, belgeli ve sigortalı araçlarla gerçekleştirmektedir. Hizmet alan tüm yolcularımız, seyahat süresince koltuk sigortası ve genel trafik sigortası güvencesi altındadır."
  },
  {
    title: "REZERVASYON VE ONAY",
    content: "Rezervasyonlar, web sitesi üzerinden veya çağrı merkezi aracılığıyla yapılmaktadır. Yapılan rezervasyonlar, tarafınıza PNR kodu içeren bir konfirme mesajı veya e-posta iletilmesiyle geçerlilik kazanır. Uçuş saatlerindeki değişiklikler yolcu tarafından bildirilmelidir."
  },
  {
    title: "BEKLEME SÜRELERİ",
    content: "Havalimanı karşılamalarında, uçağınızın inişinden itibaren 60 dakika bekleme süresi ücretsizdir. Otel veya adresten alımlarda bekleme süresi 15 dakika ile sınırlıdır. Bu süreleri aşan durumlarda şoförümüz veya operasyon merkezimiz sizinle iletişime geçmeye çalışacaktır."
  },
  {
    title: "İPTAL VE İADE KOŞULLARI",
    content: "Transfer saatine 24 saat kalaya kadar yapılan iptallerde ödemenin tamamı iade edilir. 24 saatten az, 12 saatten fazla kalan sürelerdeki iptallerde %50 kesinti uygulanır. 12 saatten az kalan sürelerde veya araç adrese ulaştıktan sonra yapılan iptallerde iade yapılmamaktadır."
  },
  {
    title: "BAGAJ POLİTİKASI",
    content: "Her yolcunun bir adet standart valiz ve bir adet el bagajı hakkı bulunmaktadır. Bebek arabası, tekerlekli sandalye veya spor ekipmanları (golf çantası, kayak takımı vb.) rezervasyon esnasında mutlaka bildirilmelidir. Bildirilmeyen aşırı bagajlar kapasite aşımına neden olursa ek araç gerekebilir."
  },
  {
    title: "ARAÇ İÇİ KURALLAR",
    content: "T.C. yasaları gereği araçlarımızın içerisinde sigara ve tütün mamullerinin tüketilmesi kesinlikle yasaktır. Yolcuların araç içerisinde alkol tüketmesi ve araç güvenliğini tehlikeye atacak davranışlarda bulunması durumunda şoför transferi sonlandırma yetkisine sahiptir."
  },
  {
    title: "EVCİL HAYVAN TAŞIMA",
    content: "Evcil hayvanlar, yalnızca kafes içerisinde ve rezervasyon aşamasında bilgi verilmesi şartıyla taşınabilmektedir. Kafes dışındaki evcil hayvanlar, araç döşemelerine zarar verebileceği ve alerjik durumlar oluşturabileceği için kabul edilmemektedir."
  },
  {
    title: "YOLCU SORUMLULUKLARI",
    content: "Yolcular, transfer saatinde belirlenen noktada hazır bulunmakla yükümlüdür. Araç içerisindeki kişisel eşyaların unutulması durumunda Xrem Transfer sorumluluk kabul etmez, ancak unutulan eşyanın bulunması durumunda yolcuya ulaştırılması için azami gayret gösterilir."
  }
];

export default function YolcuTasimaPolitikası() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <img 
          src="/how-it-works/hizli-rezervasyon.jpeg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/80 to-cream/85 backdrop-blur-[1px]" />
      </div>

      <section className="relative pt-44 pb-24 overflow-hidden text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 relative z-10"
        >
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 text-[#1a1a1a]">
            YOLCU TAŞIMA <br /> <span className="text-gold">POLİTİKASI</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-[12px] tracking-[0.8em] uppercase font-black opacity-80">
            XREMTRANSFER | RESMİ HİZMET VE GÜVENLİK ŞARTLARI
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {POLICIES.map((item, index) => (
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
            Bu politika metni yolcu güvenliği ve hizmet kalitesi standartları gereği <br />
            <span className="text-[#1a1a1a] text-xs">XREM TURİZM TAŞIMACILIK LTD. ŞTİ.</span> tarafından düzenlenmiştir.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}