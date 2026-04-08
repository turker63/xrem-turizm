"use client";

import { motion } from "framer-motion";

export default function TicketDetail({ booking }: { booking: any }) {
  if (!booking) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full mt-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl"
    >
      {/* ÜST BİLGİ BANDI */}
      <div className="bg-gold p-4 flex justify-between items-center px-8">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-black/50 uppercase tracking-widest">REZERVASYON NO</span>
          <span className="text-black font-black italic tracking-tighter text-lg">{booking.pnr}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-black text-black/50 uppercase tracking-widest">DURUM</span>
          <p className="text-black font-black italic text-xs uppercase">ONAYLANDI / ÖDENDİ</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* 📋 YOLCU VE İLETİŞİM BİLGİLERİ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/5 pb-8">
          <InfoItem label="YOLCU ADI" value={booking.fullName} />
          <InfoItem label="TELEFON" value={booking.phone} />
          <InfoItem label="TC KİMLİK" value={booking.tcNo} />
          <InfoItem label="E-POSTA" value={booking.email} />
          <InfoItem label="YOLCU SAYISI" value={`${booking.adults} Yetişkin ${booking.children > 0 ? `+ ${booking.children} Çocuk` : ""}`} />
        </div>

        {/* 🚐 TRANSFER VE ARAÇ DETAYLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] text-gold font-black tracking-[0.4em] uppercase italic">Transfer Detayı</span>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">ALINIŞ</span>
                <span className="text-sm font-bold italic uppercase">{booking.pickup}</span>
              </div>
              <span className="text-gold opacity-30">➔</span>
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">VARIŞ</span>
                <span className="text-sm font-bold italic uppercase">{booking.dropoff}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="TARİH / SAAT" value={`${booking.date} | ${booking.time}`} />
            <InfoItem label="ARAÇ TİPİ" value={booking.vehicle} gold />
          </div>
        </div>

        {/* 📝 ÖZEL NOTLAR */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest block mb-2 text-center">Özel İstekler ve Notlar</span>
          <p className="text-center text-[10px] italic text-gray-300 uppercase tracking-tighter">
            {booking.notes || "Belirtilen özel bir istek bulunmuyor."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function InfoItem({ label, value, gold }: { label: string, value: string, gold?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-xs font-black italic uppercase tracking-tighter ${gold ? 'text-gold' : 'text-white'}`}>{value}</span>
    </div>
  );
}