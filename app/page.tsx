"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

import HeroSlider from '../components/HeroSlider';
import HeroSearchForm from '../components/HeroSearchForm';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import VehicleList from '../components/VehicleList';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import BookingForm from '../components/BookingForm';
import ReservationInquiry from '../components/Inquiry';
import Partners from '../components/Partners'; 
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    if (window.location.hash === "#booking") {
      const element = document.getElementById("booking");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500); 
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-x-hidden">
      
      <HeroSlider />

      <div id="booking" className="relative z-30 max-w-6xl mx-auto px-4 -mt-24 md:-mt-32 mb-16 scroll-mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <HeroSearchForm />
          <ReservationInquiry />
        </motion.div>
      </div>

      <div className="relative z-20 w-full space-y-0">
        <Features />
        <Stats />
        <Services />
        <HowItWorks />
        
        <section id="vehicles" className="py-20 bg-cream scroll-mt-24">
          <VehicleList />
        </section>

        <Testimonials />
        <FAQ />
        
        <section className="py-20 bg-cream">
          <BookingForm />
        </section>
      </div>

      <Partners />
      <Footer />

    </main>
  );
}