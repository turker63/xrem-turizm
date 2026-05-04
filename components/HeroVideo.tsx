"use client";

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black z-0 overflow-hidden pointer-events-none">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/xrem-hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />
    </div>
  );
}