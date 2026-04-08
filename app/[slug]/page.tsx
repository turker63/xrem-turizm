"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleList from "@/components/VehicleList"; // Araç listesi bileşenin
import HeroSearchForm from "@/components/HeroSearchForm"; // Arama formu

export default function RegionalTransferPage() {
  const params = useParams();
  const slug = params.slug as string;

  // URL'den gelen metni temizleyip başlığa dönüştürür (Örn: antalya-kundu-transfer -> Antalya Kundu Transfer)
  const regionName = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Bölge Özel Hero Alanı */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`https://source.unsplash.com/featured/?antalya,resort`} 
            className="w-full h-full object-cover brightness-[0.4]" 
            alt={regionName}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#050505]" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tighter uppercase"
          >
            {regionName}
          </motion.h1>
          <p className="text-gold mt-4 uppercase tracking-[0.4em] text-[10px] md:text-xs font-black">
            VIP Transfer Hizmeti & 7/24 Rezervasyon
          </p>
        </div>
      </section>

      {/* Arama Formu (Bölgeye Özel) */}
      <div className="-mt-20 relative z-30">
        <HeroSearchForm defaultDropoff={regionName} />
      </div>

      {/* Araç Seçenekleri */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black uppercase tracking-widest text-white">
            UYGUN <span className="text-gold">ARAÇLARIMIZ</span>
          </h2>
        </div>
        <VehicleList />
      </section>

      <Footer />
    </main>
  );
}