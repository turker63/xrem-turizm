/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Senin istediğin o özel krem tonu
        cream: {
          DEFAULT: '#fff9e9',
          dark: '#f2ece0', // Biraz daha gölgeli yerler için
        },
        // Lüks hissi veren altın/gold tonları
        gold: {
          light: '#d4af37',
          DEFAULT: '#bf953f',
          dark: '#a67c00',
        },
        // Arka plan ve yazılar için derin siyah/antrasit
        luxury: {
          black: '#111111',
          dark: '#1a1a1a',
          gray: '#4a4a4a',
        }
      },
      // Animasyonların çalışması için gerekli temel ayarlar
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}