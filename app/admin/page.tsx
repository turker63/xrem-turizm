"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Euro, MapPin, CheckCircle, XCircle, 
  Car, AlertCircle, UserCheck, Eye, MessageCircle,
  Navigation as NavIcon, Ticket, TrendingUp, Activity
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  
  // 💾 ANA VERİ DEPOLARI
  const [todayTransfers, setTodayTransfers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  
  // 📊 İSTATİSTİK VE GRAFİK STATE'LERİ
  const [stats, setStats] = useState({ dailyRevenue: 0, pendingPayments: 0, todayTrips: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartFilter, setChartFilter] = useState<'haftalik' | 'aylik' | 'yillik'>('haftalik');
  
  const [selectedRes, setSelectedRes] = useState<any | null>(null);

  // 1. VERİLERİ ÇEKME MOTORU
  const fetchOperations = async () => {
    setLoading(true);
    
    // 🌍 TÜRKİYE SAAT DİLİMİ
    const formatter = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' });
    const parts = formatter.formatToParts(new Date());
    const dateObj: any = {};
    parts.forEach(({ type, value }) => { dateObj[type] = value; });
    const today = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;

    const { data: transfers } = await supabase.from("reservations").select("*").eq("transfer_date", today).order("transfer_time", { ascending: true });
    const { data: driversData } = await supabase.from("drivers").select("*").order("full_name", { ascending: true });
    const { data: allRes } = await supabase.from("reservations").select("*");

    setDrivers(driversData || []);
    setTodayTransfers(transfers || []);
    setAllReservations(allRes || []);

    if (allRes && transfers) {
      // 👑 BUGÜNÜN İSTATİSTİKLERİ
      const dailyRev = transfers.filter(t => t.status === 'PAID' || t.status === 'COMPLETED')
                                .reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
      const pending = allRes.filter(r => r.status === 'WAITING').length;
      const validTrips = transfers.filter(t => t.status !== 'CANCELLED').length; // İptal olmayan bugünkü seferler
      
      setStats({ dailyRevenue: dailyRev || 0, pendingPayments: pending, todayTrips: validTrips });
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchOperations(); }, []);

  // 2. GRAFİK FİLTRELEME MOTORU (Veri değiştiğinde veya filtreye basıldığında çalışır)
  useEffect(() => {
    if (allReservations.length === 0) return;

    const generateChartData = () => {
      if (chartFilter === 'haftalik') {
        // SON 7 GÜN
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0];
        });
        return last7Days.map(date => {
          const dayRes = allReservations.filter(r => r.transfer_date === date && (r.status === 'PAID' || r.status === 'COMPLETED'));
          const dayRev = dayRes.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
          return { name: date.slice(5).replace('-', '/'), Ciro: dayRev, Sefer: dayRes.length };
        });
      } 
      else if (chartFilter === 'aylik') {
        // SON 30 GÜN
        const last30Days = Array.from({length: 30}, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (29 - i)); return d.toISOString().split('T')[0];
        });
        return last30Days.map(date => {
          const dayRes = allReservations.filter(r => r.transfer_date === date && (r.status === 'PAID' || r.status === 'COMPLETED'));
          const dayRev = dayRes.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
          return { name: date.slice(8), Ciro: dayRev, Sefer: dayRes.length }; // Sadece gün sayısı görünür (01, 02 vs.)
        });
      } 
      else if (chartFilter === 'yillik') {
        // BU YILIN AYLARI
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const currentYear = new Date().getFullYear();
        return months.map((m, i) => {
          const monthStr = String(i + 1).padStart(2, '0');
          const monthRes = allReservations.filter(r => r.transfer_date?.startsWith(`${currentYear}-${monthStr}`) && (r.status === 'PAID' || r.status === 'COMPLETED'));
          const monthRev = monthRes.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
          return { name: m, Ciro: monthRev, Sefer: monthRes.length };
        });
      }
      return [];
    };

    setChartData(generateChartData());
  }, [chartFilter, allReservations]);

  // AKSİYONLAR
  const handleAssignDriver = async (resId: string, driverName: string) => {
    const { error } = await supabase.from("reservations").update({ assigned_driver: driverName }).eq("id", resId);
    if (!error) setTodayTransfers(prev => prev.map(item => item.id === resId ? { ...item, assigned_driver: driverName } : item));
  };

  const updateResStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("reservations").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setTodayTransfers(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      fetchOperations(); // Statü değişince grafikleri anlık yansıt
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 👑 1. ÜST PANEL (HIZLI İSTATİSTİKLER) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* YENİ EKLENEN: BUGÜNKÜ SEFERLER KARTI */}
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.04] transition-all group">
           <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
             <Activity size={24} />
           </div>
           <div>
             <p className="text-[10px] text-gray-500 font-bold uppercase italic tracking-widest">Bugünkü Seferler</p>
             <p className="text-2xl font-black text-white italic">{stats.todayTrips} <span className="text-[10px] text-gray-600 font-normal tracking-normal uppercase">Aktif</span></p>
           </div>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.04] transition-all group">
           <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
             <Euro size={24} />
           </div>
           <div>
             <p className="text-[10px] text-gray-500 font-bold uppercase italic tracking-widest">Bugünkü Ciro</p>
             <p className="text-2xl font-black text-white italic">€{stats.dailyRevenue}</p>
           </div>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.04] transition-all group">
           <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
             <AlertCircle size={24} />
           </div>
           <div>
             <p className="text-[10px] text-gray-500 font-bold uppercase italic tracking-widest">Bekleyen İşlem</p>
             <p className="text-2xl font-black text-white italic">{stats.pendingPayments}</p>
           </div>
        </div>
      </div>

      {/* 📊 2. DİNAMİK FİNANSAL RADAR GRAFİĞİ */}
      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* GRAFİK BAŞLIĞI VE FİLTRE BUTONLARI */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 gap-4">
          <h3 className="text-sm font-black uppercase italic tracking-widest text-white flex items-center gap-3">
            <TrendingUp size={18} className="text-gold" /> Finansal Hacim Analizi
          </h3>
          
          {/* FİLTRELEME BUTONLARI */}
          <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1">
            {['haftalik', 'aylik', 'yillik'].map((filter) => (
              <button
                key={filter}
                onClick={() => setChartFilter(filter as any)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  chartFilter === filter ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                {filter === 'haftalik' ? 'Son 7 Gün' : filter === 'aylik' ? 'Son 30 Gün' : 'Bu Yıl'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[280px] w-full relative z-10">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gold font-black tracking-[0.3em] uppercase animate-pulse">Grafik Motoru Yükleniyor...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} dx={-10} />
                
                <Tooltip
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#D4AF37', fontWeight: '900', fontStyle: 'italic' }}
                  cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 2 }}
                />
                
                <Area type="monotone" dataKey="Ciro" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorCiro)" activeDot={{ r: 6, fill: '#D4AF37', stroke: '#000', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 🗓️ 3. BUGÜNÜN AJANDASI VE ŞOFÖR ATAMA */}
      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-sm font-black uppercase italic tracking-widest text-white flex items-center gap-3">
            <Car size={18} className="text-gold" /> Günlük Operasyon Akışı
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] text-gray-600 font-black uppercase italic border-b border-white/5">
                <th className="p-6">ALIŞ SAATİ</th>
                <th className="p-6">MÜŞTERİ</th>
                <th className="p-6">GÜZERGAH</th>
                <th className="p-6">KAPTAN / ARAÇ</th>
                <th className="p-6">DURUM</th>
                <th className="p-6 text-right">AKSİYON</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold italic uppercase text-white">
              {todayTransfers.length === 0 && !loading && (
                <tr><td colSpan={6} className="p-10 text-center text-gray-500 tracking-widest">BUGÜN İÇİN KAYITLI TRANSFER BULUNMUYOR</td></tr>
              )}
              {todayTransfers.map((res, i) => (
                <tr key={i} className={`border-b border-white/[0.02] transition-all group ${res.status === 'COMPLETED' ? 'opacity-50 grayscale' : 'hover:bg-white/[0.02]'}`}>
                  <td className="p-6 text-gold font-black text-lg">
                    {res.transfer_time?.slice(0, 5) || "00:00"}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span>{res.full_name}</span>
                      <span className="text-[9px] text-gray-500 lowercase font-normal">{res.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-[10px]"><p className="text-gray-300">{res.pickup?.split(',')[0]}</p><p className="text-gray-600">➔ {res.dropoff?.split(',')[0]}</p></div>
                  </td>
                  <td className="p-6">
                    <div className="relative flex items-center gap-2">
                      <UserCheck size={14} className={res.assigned_driver ? "text-gold" : "text-gray-700"} />
                      <select 
                        value={res.assigned_driver || ""} 
                        onChange={(e) => handleAssignDriver(res.id, e.target.value)}
                        className="bg-black/40 border border-white/5 text-[10px] p-2 rounded-lg outline-none focus:border-gold transition-all cursor-pointer appearance-none pr-8"
                      >
                        <option value="">Şoför Seçilmedi</option>
                        {drivers.map(d => (
                          <option key={d.id} value={d.full_name} className="bg-[#0a0a0a]">
                            {d.full_name} ({d.license_plate})
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] border ${res.status === 'PAID' ? 'text-green-500 border-green-500/10' : res.status === 'COMPLETED' ? 'text-blue-500 border-blue-500/10' : 'text-yellow-500 border-yellow-500/10'}`}>
                      {res.status === 'PAID' ? 'ÖDENDİ' : res.status === 'COMPLETED' ? 'TAMAMLANDI' : 'BEKLİYOR'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => setSelectedRes(res)} className="p-2 bg-white/5 text-white rounded-lg hover:bg-gold hover:text-black" title="Detayları Gör"><Eye size={14} /></button>
                      <a href={`https://wa.me/${res.phone}`} target="_blank" className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white"><MessageCircle size={14} /></a>
                      {res.status !== 'COMPLETED' && (
                        <button onClick={() => updateResStatus(res.id, 'COMPLETED')} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white" title="Tamamlandı"><CheckCircle size={14} /></button>
                      )}
                      <button onClick={() => updateResStatus(res.id, 'CANCELLED')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white" title="İptal Et"><XCircle size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👁️ 4. REZERVASYON DETAY MODALI (Dokunulmadı) */}
      <AnimatePresence>
        {selectedRes && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRes(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-gold tracking-tight">Transfer Detayı</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-1">PNR: {selectedRes.pnr_code || "YOK"}</p>
                </div>
                <button onClick={() => setSelectedRes(null)} className="p-2 bg-white/5 rounded-full hover:bg-red-500 hover:text-white transition-all text-gray-400"><XCircle size={24} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white uppercase text-[10px] font-black tracking-tight">
                <div className="space-y-6">
                  <div><span className="text-[8px] text-gray-500 block mb-1">MÜŞTERİ BİLGİLERİ</span><p className="text-sm italic">{selectedRes.full_name || "İSİMSİZ"}</p><p className="text-gray-400 mt-1">{selectedRes.phone || "---"}</p></div>
                  <div><span className="text-[8px] text-gray-500 block mb-1 flex items-center gap-1"><Car size={10}/> SEÇİLEN ARAÇ</span><p className="text-sm italic text-gold">{selectedRes.vehicle_model || "VIP Transfer Aracı"}</p></div>
                  <div><span className="text-[8px] text-gray-500 block mb-1 flex items-center gap-1"><UserCheck size={10}/> ATANAN KAPTAN</span><p className="text-sm italic text-blue-400">{selectedRes.assigned_driver || "HENÜZ ATAMA YAPILMADI"}</p></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[8px] text-gray-500 block mb-1">TRANSFER ROTASI</span>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2"><MapPin size={12} className="text-gold mt-0.5 flex-shrink-0"/><span className="leading-tight">{selectedRes.pickup || selectedRes.pickup_location || "Bilinmiyor"}</span></p>
                      <p className="flex items-start gap-2"><NavIcon size={12} className="text-gray-500 mt-0.5 flex-shrink-0"/><span className="leading-tight">{selectedRes.dropoff || selectedRes.dropoff_location || "Bilinmiyor"}</span></p>
                    </div>
                  </div>
                  <div><span className="text-[8px] text-gray-500 block mb-1">TARİH & SAAT</span><p className="text-sm italic">{selectedRes.transfer_date || "---"} | <span className="text-gold">{selectedRes.transfer_time?.slice(0, 5) || "---"}</span></p></div>
                  <div><span className="text-[8px] text-gray-500 block mb-1 flex items-center gap-1"><Ticket size={10}/> FİYAT</span><p className="text-lg font-black italic">€{selectedRes.total_price || "0"}</p></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}