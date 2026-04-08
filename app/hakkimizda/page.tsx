"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HakkimizdaPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-gold/30">
      <Navbar />

      <section className="relative pt-52 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6">
              BİZ <span className="text-gold">KİMİZ?</span>
            </h1>
            <p className="text-gray-500 text-[10px] md:text-[12px] tracking-[0.8em] uppercase font-black">
              XREMTRANSFER | PRESTİJ VE KONFORUN MERKEZİ
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 rounded-full blur-[150px] -z-10" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[3.5rem] border border-white shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center text-center md:text-left">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-black italic uppercase text-gold tracking-widest">Vizyonumuz</h2>
                <p className="text-gray-700 leading-relaxed font-bold italic">
                  Xrem Transfer olarak, Antalya başta olmak üzere tüm Akdeniz bölgesinde VIP ulaşım standartlarını saniyeler içinde yeniden tanımlıyoruz. Lojistik tecrübemizle, misafirlerimize sadece bir yolculuk değil, sarsıntısız bir prestij deneyimi mühürlüyoruz.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 border-t md:border-t-0 md:border-l border-gray-300 pt-8 md:pt-0 md:pl-16"
              >
                <h2 className="text-3xl font-black italic uppercase text-gold tracking-widest">Misyonumuz</h2>
                <p className="text-gray-700 leading-relaxed font-bold italic">
                  Güvenlik ve konforu dijital teknolojilerle birleştirerek, her transferi saniyeler içinde kişiselleştirilmiş bir hizmete dönüştürmek. En modern araç filomuz ve profesyonel ekibimizle seyahatlerinizi mühür altına alıyoruz.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              title="7/24 OPERASYON" 
              desc="Lojistik ağımız saniyeler içinde taleplerinize cevap verecek şekilde 24 saat mühürlenmiştir." 
            />
            <FeatureCard 
              title="VIP FİLO" 
              desc="Son model Mercedes-Benz araçlarımızla konforu saniyeler içinde her km'de hissedeceksiniz." 
            />
            <FeatureCard 
              title="GÜVENLİ MÜHÜR" 
              desc="Tüm yolculuklarınız yasal izinler ve sigorta kapsamında saniyeler içinde güvence altına alınır." 
            />
          </div>
        </div>
      </section>

      <section className="py-40 text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 relative z-10 bg-white/80 backdrop-blur-xl rounded-[3.5rem] p-12 md:p-16 border border-white shadow-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-8 leading-tight text-[#1a1a1a]">
            YOLCULUĞUNUZU <br /> <span className="text-gold">ŞİMDİ PLANLAYIN</span>
          </h2>
          <Link href="/rezervasyon-yap">
            <button className="bg-[#1a1a1a] text-white px-16 py-6 rounded-full font-black uppercase text-[12px] tracking-[0.3em] hover:bg-gold transition-all shadow-2xl active:scale-95">
              REZERVASYON YAP
            </button>
          </Link>
        </motion.div>
        <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full translate-y-1/2 opacity-30" />
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 rounded-[3rem] border border-white bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-gold/50 transition-all text-center group"
    >
      <div className="w-12 h-1 bg-gold mx-auto mb-8 group-hover:w-24 transition-all" />
      <h3 className="text-xl font-black italic uppercase mb-4 tracking-widest text-[#1a1a1a] group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-gray-700 text-xs font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );
}