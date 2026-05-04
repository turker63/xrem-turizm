"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PublicGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchImages = async () => {
      const { data } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setImages(data);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999999 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-zoom-out"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 max-w-[90vw] max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#bf953f] transition-colors p-2"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Büyük Galeri Görseli"
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(191,149,63,0.3)] border border-[#bf953f]/30"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-4">
        <span className="text-[#bf953f]">GALERİ</span>
        </h1>
        <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs italic">
          
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedImage(img.image_url)}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 group shadow-2xl cursor-pointer"
          >
            <img 
              src={img.image_url} 
              alt="XREM Turizm Galeri" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {mounted && createPortal(modalContent, document.body)}
    </div>
  );
}