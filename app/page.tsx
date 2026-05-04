"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

import HeroVideo from '../components/HeroVideo';
import HeroSearchForm from '../components/HeroSearchForm';
import PopularRoutes from '../components/PopularRoutes';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import VehicleList from '../components/VehicleList';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import BookingForm from '../components/BookingForm';
import Partners from '../components/Partners'; 
import Footer from '../components/Footer';
import TripadvisorWidget from '@/components/TripadvisorWidget';

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

  const WaveTop = () => (
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none z-10">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[15px] md:h-[25px]">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
      </svg>
    </div>
  );

  const WaveBottom = () => (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 pointer-events-none z-10">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[15px] md:h-[25px]">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
      </svg>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col relative overflow-x-hidden bg-white p-0 m-0 w-full">
      

      <section className="absolute top-0 left-0 w-full h-[100vh] z-0">
        <HeroVideo />
      </section>


      <div className="relative z-50 w-full h-[100vh] flex flex-col justify-center items-center pointer-events-none pb-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full pointer-events-auto">
          <HeroSearchForm />
        </motion.div>
      </div>

      <div className="bg-white w-full relative z-30 flex flex-col rounded-t-[2.5rem] md:rounded-t-[4rem] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pt-12">
        

        <section id="routes" className="py-8 bg-white"><PopularRoutes /></section>
        

        <div className="relative w-full bg-cream-dark py-10 mt-2">
          <WaveTop />
          <section id="features" className="relative z-20 max-w-7xl mx-auto px-4">
            <Features />
            <div className="mt-8"><Stats /></div>
          </section>
          <WaveBottom />
        </div>


        <section id="services" className="py-8 bg-white"><Services /></section>


        <div className="relative w-full bg-cream-dark py-10 my-2">
          <WaveTop />
          <section id="how-it-works" className="relative z-20 max-w-7xl mx-auto px-4">
            <HowItWorks />
          </section>
          <WaveBottom />
        </div>
        
      
        <section id="vehicles" className="py-8 bg-white scroll-mt-20"><VehicleList /></section>
        

        <div className="relative w-full bg-cream-dark py-14 my-2">
          <WaveTop />
          <div className="max-w-7xl mx-auto px-4 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-3 order-2 lg:order-1">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white border-2 border-[#E5DFD3] p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
                  <h4 className="text-sm font-black text-[#2C2C2C] uppercase tracking-widest mb-4"><br/><span className="text-[#D4AF37]"></span></h4>
                  <TripadvisorWidget />
                </motion.div>
              </div>

              <div className="lg:col-span-9 order-1 lg:order-2">
                <Testimonials />
           
              </div>

            </div>
          </div>
          <WaveBottom />
        </div>


        <section id="faq" className="py-8 bg-white"><FAQ /></section>


        <section id="contact" className="py-12 bg-[#2C2C2C] text-white">
          <BookingForm />
        </section>

        <Partners />
        <Footer />
        
      </div>
    </main>
  );
}