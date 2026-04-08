"use client";

import { useEffect } from "react";

export default function RightClickBlocker() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null; // Görsel bir şey döndürmez, sadece arka planda çalışır
}