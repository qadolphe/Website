"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, Coffee, Car, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="flex min-h-[100dvh] flex-col justify-between bg-[#0a0a0a] text-[#ededed] antialiased selection:bg-[#f59e0b] selection:text-black overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-rounded: ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif;
        }
        .font-rounded { font-family: var(--font-rounded); }
      `}} />

      {/* Subtle background image */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-lighten pointer-events-none">
        <Image 
          src="/images/OtterSwim.png" 
          alt="Stars background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-0 pointer-events-none" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6 sm:px-12 sm:py-8 font-rounded">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl tracking-tight text-[#f59e0b]" 
          style={{ fontWeight: 900 }}
        >
          EarlyOtter
        </motion.div>
        <nav className="flex items-center gap-6 text-[15px] font-medium text-neutral-400">
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="/support" className="transition-colors hover:text-white">Support</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-16 px-6 sm:px-12 lg:flex-row font-rounded py-12 lg:py-20 lg:pb-32">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left pt-4 lg:pt-0"
        >
          <h1 className="mb-6 text-[3.5rem] leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]" style={{ fontWeight: 900 }}>
            Wake up to <br />
            what matters.
          </h1>
          
          <p className="mb-10 max-w-lg text-[19px] font-semibold leading-relaxed text-neutral-400 sm:text-[22px]">
            A beautiful, privacy-first smart alarm natively synced with your schedule. No more morning math.
          </p>

          <Link href="https://apps.apple.com/us/app/earlyotter/id6766083287" target="_blank" className="group flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-[18px] text-black shadow-lg hover:bg-neutral-100 transition-all hover:scale-[1.02] active:scale-95" style={{ fontWeight: 800 }}>
            Download on the App Store
          </Link>
        </motion.div>

        {/* Right Content - App Representation */}
        <div className="relative flex flex-1 flex-col items-center justify-center lg:justify-end w-full max-w-lg pt-16 lg:pt-0">
          <div className="absolute inset-0 top-1/4 rounded-full bg-[#f59e0b]/10 blur-[120px]" />
          
          <div className="relative w-full max-w-[380px] font-rounded z-10">
            {/* Peeking Otter - Delay slightly to appear after card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isMounted ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              className="absolute -top-[5.2rem] right-4 w-32 h-32 z-20 pointer-events-none drop-shadow-xl"
            >
              <Image 
                src="/images/OtterOverlook.png" 
                alt="Cute otter peeking over" 
                fill
                className="object-contain object-bottom"
              />
            </motion.div>

            {/* Top Card (Next Alarm) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isMounted ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative rounded-[2.5rem] border border-white/10 bg-[#1c1c1e] p-7 shadow-2xl z-10"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                   <div className="text-[20px] font-bold text-neutral-300">Next Alarm</div>
                   <Sparkles className="w-5 h-5 text-[#f59e0b] opacity-80" />
                </div>
                <div className="mt-1 text-[15px] font-semibold text-neutral-400">In 9 hours, 46 minutes</div>
                
                <div className="mt-3 text-[5.5rem] leading-none text-white tracking-tight" style={{ fontWeight: 900 }}>
                  7:25<span className="text-[2rem] ml-1.5 opacity-90 font-heavy">AM</span>
                </div>
                
                <div className="mt-5 flex items-center justify-between font-bold text-neutral-400 border-t border-white/5 pt-4">
                  <span className="flex items-center gap-2 text-[15px]"><Calendar className="w-4 h-4 text-[#f59e0b]" /> English Class</span>
                  <span className="text-[14px]">8:30 AM</span>
                </div>
              </div>
            </motion.div>
            
            {/* Bottom Card (Applied Rule) - Animated Slide Out */}
            <motion.div 
              initial={{ opacity: 0, y: -40, zIndex: 0 }}
              animate={isMounted ? { opacity: 1, y: 16, zIndex: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className="relative rounded-[2.5rem] border border-white/10 bg-[#151517] p-7 shadow-xl z-0"
            >
               <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-neutral-400 px-1">Applied Rule</div>
               <div className="mb-5 text-[26px] text-white px-1" style={{ fontWeight: 900 }}>Class</div>
               
               <div className="flex flex-col gap-4 text-[16px] font-bold text-neutral-400 bg-[#2c2c2e]/30 rounded-3xl p-5 border border-white/5">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                     <div className="flex flex-col">
                        <span className="flex items-center gap-2 text-white"><Clock className="w-4 h-4 text-[#f59e0b]" /> Wake Time</span>
                        <span className="text-[12px] font-semibold mt-1 ml-6 text-neutral-500">Default • Snooze 10m</span>
                     </div>
                     <span className="text-white text-[18px]">7:25 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-neutral-500" /> Prep Time</span>
                     <span>35m</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                     <span className="flex items-center gap-2"><Car className="w-4 h-4 text-neutral-500" /> Commute</span>
                     <span>30m</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl p-6 text-center text-[14px] font-bold text-neutral-600 sm:p-12 font-rounded">
        <div>© {isMounted ? new Date().getFullYear() : "2026"} EarlyOtter. All rights reserved.</div>
      </footer>
    </main>
  );
}
