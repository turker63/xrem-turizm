"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('ref=banner')) {
      sessionStorage.setItem('hasSeenWelcomePopup', 'true');
      return;
    }

    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomePopup', 'true');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-[640px] aspect-square rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(191,149,63,0.6)] border border-gold/50 cursor-pointer"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="absolute top-5 right-5 z-20 bg-black/70 text-white p-2.5 rounded-full hover:bg-gold transition-colors backdrop-blur-md shadow-lg"
            >
              <X size={28} />
            </button>

            <a 
              href="/hizmetler/vip-yat-kiralama?ref=banner"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block w-full h-full"
            >
              <img
                src="/giris-pankart.jpg" 
                alt="VIP Transfer Kampanya"
                className="w-full h-full object-cover block"
              />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}