"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function TripadvisorWidget() {
  const { lang } = useLanguage();

  const content: any = {
    tr: {
      travelerRating: "Tripadvisor Gezgin Puanı",
      reviews: "73 yorum",
      rankingTitle: "Tripadvisor Sıralaması",
      ranking: "#30 / 688 Ulaşım şuradaki: Antalya",
      recentReviews: "Son Gezgin Yorumları",
      quotes: [
        '"Mükemmel deneyim"',
        '"Mükemmel bir yolculuk"',
        '"İş seyehati"',
        '"Superdi"',
        '"Güvenle tercih edebilirsiniz."'
      ],
      readReviews: "Yorumları oku",
      writeReview: "Bir yorum yazın"
    },
    en: {
      travelerRating: "Tripadvisor Traveler Rating",
      reviews: "73 reviews",
      rankingTitle: "Tripadvisor Ranking",
      ranking: "#30 of 688 Transportation in Antalya",
      recentReviews: "Recent Traveler Reviews",
      quotes: [
        '"Excellent experience"',
        '"A perfect journey"',
        '"Business trip"',
        '"It was super"',
        '"You can choose with confidence."'
      ],
      readReviews: "Read reviews",
      writeReview: "Write a review"
    },
    ru: {
      travelerRating: "Рейтинг путешественников Tripadvisor",
      reviews: "73 отзыва",
      rankingTitle: "Рейтинг Tripadvisor",
      ranking: "#30 из 688 Транспорт в Анталии",
      recentReviews: "Последние отзывы путешественников",
      quotes: [
        '"Отличный опыт"',
        '"Идеальное путешествие"',
        '"Деловая поездка"',
        '"Это было супер"',
        '"Вы можете выбирать с уверенностью."'
      ],
      readReviews: "Читать отзывы",
      writeReview: "Написать отзыв"
    },
    de: {
      travelerRating: "Tripadvisor-Reisendenbewertung",
      reviews: "73 Bewertungen",
      rankingTitle: "Tripadvisor-Ranking",
      ranking: "Nr. 30 von 688 Transport in Antalya",
      recentReviews: "Aktuelle Bewertungen von Reisenden",
      quotes: [
        '"Ausgezeichnete Erfahrung"',
        '"Eine perfekte Reise"',
        '"Geschäftsreise"',
        '"Es war super"',
        '"Sie können mit Zuversicht wählen."'
      ],
      readReviews: "Bewertungen lesen",
      writeReview: "Eine Bewertung schreiben"
    }
  };

  const t = content[lang] || content.en;

  const Bubbles = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((bubble) => (
        <div key={bubble} className="w-4 h-4 rounded-full bg-[#00aa6c]" />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-[300px] bg-white border border-[#00aa6c] p-5 font-sans shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#00aa6c] rounded-full flex items-center justify-center p-1.5 shadow-sm">
          <img 
            src="/tripadvisor.ico" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-xl font-black text-black tracking-tighter">Tripadvisor</span>
      </div>

      <h2 className="text-2xl font-bold text-black mb-3">
        <Link href="https://www.tripadvisor.com.tr/Attraction_Review-g297962-d17540855-Reviews-Xrem-Antalya_Turkish_Mediterranean_Coast.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00aa6c] transition-colors">
          Xrem
        </Link>
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-1">{t.travelerRating}</p>
        <div className="flex items-center gap-2">
          <Bubbles />
          <span className="text-sm text-gray-800">{t.reviews}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-1">{t.rankingTitle}</p>
        <p className="text-base text-black">
          <span className="font-bold text-lg leading-none mr-1">#</span>
          {t.ranking}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-800 mb-2">{t.recentReviews}</p>
        <ul className="flex flex-col gap-2">
          {t.quotes.map((quote: string, idx: number) => (
            <li key={idx} className="text-sm text-black font-medium leading-tight">
              {quote}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-sm text-black">
        <Link href="https://www.tripadvisor.com.tr/Attraction_Review-g297962-d17540855-Reviews-Xrem-Antalya_Turkish_Mediterranean_Coast.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00aa6c] font-medium">{t.readReviews}</Link>
        <span className="text-gray-400">|</span>
        <Link href="https://www.tripadvisor.com.tr/UserReviewEdit-g297962-d17540855-Xrem-Antalya_Turkish_Mediterranean_Coast.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00aa6c] font-medium">{t.writeReview}</Link>
      </div>
    </div>
  );
}