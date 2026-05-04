"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";

export default function AdminGallery() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setImages(data);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    setMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        await supabase.from("gallery").insert([
          { image_url: publicUrlData.publicUrl, title: file.name }
        ]);
      }
      setMessage("Fotoğraflar başarıyla yüklendi!");
      fetchImages();
      setFiles(null);
    } catch (error) {
      setMessage("Yükleme sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, url: string) => {
    const fileName = url.split("/").pop();
    if (!fileName) return;

    await supabase.storage.from("gallery").remove([fileName]);
    await supabase.from("gallery").delete().eq("id", id);
    fetchImages();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-2">
        <ImageIcon className="text-gold" /> Müşteri Galerisi Yönetimi
      </h1>

      <div className="bg-[#050505] p-8 rounded-3xl border border-white/5 mb-12">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-10 hover:border-gold transition-colors relative mb-6">
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="text-gold mb-4" size={40} />
          <p className="text-gray-400 font-bold text-center">
            {files ? `${files.length} dosya seçildi` : "Fotoğrafları seçmek için tıklayın veya sürükleyin"}
          </p>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={isLoading || !files}
          className="w-full bg-gold hover:bg-gold/80 text-black font-black py-4 rounded-xl uppercase tracking-widest disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Seçilenleri Yükle"}
        </button>

        {message && (
          <div className="mt-4 p-4 rounded-xl bg-white/5 text-gold text-center font-bold flex items-center justify-center gap-2">
            <CheckCircle size={18} /> {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5">
            <img src={img.image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => handleDelete(img.id, img.image_url)}
                className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}