"use client";

import { usePathname } from "next/navigation";

export default function CrystalBackground() {
  const pathname = usePathname();
  
  // Eğer admin panelindeyse bu şekilleri gösterme (İsteğe bağlı)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-white">
      {/* Sol Üst - Pudra Kavis */}
      <div className="absolute top-0 left-0 w-64 md:w-[30rem] h-64 md:h-[30rem] bg-[#C88A83] rounded-br-[100%] opacity-[0.15]" />
      
      {/* Sağ Üst - Soft Altın Kavis */}
      <div className="absolute top-0 right-0 w-80 md:w-[40rem] h-80 md:h-[40rem] bg-[#E8CD89] rounded-bl-[100%] opacity-[0.15]" />
      
      {/* Sol Alt - Turkuaz Kavis */}
      <div className="absolute bottom-0 left-0 w-72 md:w-[35rem] h-72 md:h-[35rem] bg-[#4CBEC4] rounded-tr-[100%] opacity-[0.15]" />
    </div>
  );
}