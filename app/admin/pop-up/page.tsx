"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Link as LinkIcon, CheckCircle, Image as ImageIcon, Trash2 } from "lucide-react";

export default function AdminPopupManager() {
  const [file, setFile] = useState<File | null>(null);
  const [targetLink, setTargetLink] = useState("");
  const [currentData, setCurrentData] = useState<{ image_url: string; target_link: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCurrentPopup();
  }, []);

  const fetchCurrentPopup = async () => {
    const { data } = await supabase
      .from("popups")
      .select("image_url, target_link")
      .eq("is_active", true)
      .single();

    if (data) {
      setCurrentData(data);
      setTargetLink(data.target_link);
    }
  };

  const handleSave = async () => {
    if (!targetLink) {
      setMessage("Lütfen bir hedef link girin!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      let finalImageUrl = currentData?.image_url || "";

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("popups")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("popups")
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      await supabase
        .from("popups")
        .update({ is_active: false })
        .eq("is_active", true);

      await supabase
        .from("popups")
        .insert([{ image_url: finalImageUrl, target_link: targetLink, is_active: true }]);

      setMessage("Afiş başarıyla yayına alındı!");
      fetchCurrentPopup();
      setFile(null);
    } catch (error) {
      setMessage("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await supabase
        .from("popups")
        .update({ is_active: false })
        .eq("is_active", true);

      setCurrentData(null);
      setTargetLink("");
      setFile(null);
      setMessage("Afiş siteden kaldırıldı!");
    } catch (error) {
      setMessage("Kaldırma işlemi başarısız oldu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-black uppercase tracking-widest text-luxury-dark mb-8 flex items-center gap-2">
        <ImageIcon className="text-[#bf953f]" /> Popup Afiş Yönetimi
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              Yeni Afiş Görseli Yükle
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#bf953f] transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="text-[#bf953f] mb-2" size={32} />
              <p className="text-sm font-bold text-gray-700">
                {file ? file.name : "Görsel seçmek için tıklayın veya sürükleyin"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Önerilen boyut: Kare (örn. 1080x1080px)</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
              <LinkIcon size={12} className="text-[#bf953f]" /> Hedef Link (URL)
            </label>
            <input
              type="text"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
              placeholder="/rezervasyon-yap veya https://..."
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#bf953f]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-[#bf953f] hover:bg-[#d4af37] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "İşleniyor..." : "Yayına Al"}
            </button>

            {currentData && (
              <button
                onClick={handleRemove}
                disabled={isLoading}
                className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-black px-6 py-4 rounded-xl uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 disabled:opacity-50 border border-red-200"
              >
                <Trash2 size={18} /> Kaldır
              </button>
            )}
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.includes("başarı") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              <CheckCircle size={18} /> {message}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-inner flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">
            Şu An Yayında Olan Afiş
          </h3>
          {currentData?.image_url ? (
            <div className="relative w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#bf953f]/30">
              <img
                src={file ? URL.createObjectURL(file) : currentData.image_url}
                alt="Aktif Afiş"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-sm font-bold text-gray-400">Henüz yayında afiş yok.</div>
          )}
          {currentData?.target_link && !file && (
            <p className="mt-4 text-xs font-bold text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 break-all text-center">
              Bant Linki: <br/> {currentData.target_link}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}