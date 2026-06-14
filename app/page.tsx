"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type DayDot = { top: number; bottom: number; connected: boolean } | null;
type DayData = { day: string; dots: DayDot; elapsed: boolean; today: boolean };

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [dateInfo, setDateInfo] = useState<{ title: string; days: DayData[] }>({
    title: "Jun 7 - 13",
    days: [
      { day: "S", dots: null, elapsed: true, today: false },
      { day: "M", dots: { top: 68, bottom: 85, connected: true }, elapsed: true, today: false },
      { day: "T", dots: { top: 40, bottom: 65, connected: false }, elapsed: true, today: false },
      { day: "W", dots: { top: 45, bottom: 58, connected: true }, elapsed: false, today: true },
      { day: "Th", dots: { top: 72, bottom: 85, connected: true }, elapsed: false, today: false },
      { day: "F", dots: { top: 72, bottom: 85, connected: true }, elapsed: false, today: false },
      { day: "S", dots: null, elapsed: false, today: false },
    ]
  });

  useEffect(() => {
    setIsMounted(true);
    
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); 
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const sameMonth = startOfWeek.getMonth() === endOfWeek.getMonth();
    const formatDate = (d: Date, showMonth: boolean) => d.toLocaleDateString("en-US", { month: showMonth ? 'short' : undefined, day: 'numeric' });
    
    const title = sameMonth 
      ? `${formatDate(startOfWeek, true)} - ${formatDate(endOfWeek, false)}`
      : `${formatDate(startOfWeek, true)} - ${formatDate(endOfWeek, true)}`;

    setDateInfo(prev => ({ ...prev, title }));
  }, []);

  return (
    <main className="flex min-h-[100dvh] flex-col justify-between bg-[#FFCD93] text-[#0a0a0a] antialiased selection:bg-black selection:text-[#FFCD93] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-rounded: ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif;
        }
        .font-rounded { font-family: var(--font-rounded); }
      `}} />

      {/* Subtle background image */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <Image 
          src="/images/OtterSwim.png" 
          alt="Stars background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6 sm:px-12 sm:py-4 font-rounded">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl tracking-tight text-black" 
          style={{ fontWeight: 900 }}
        >
          EarlyOtter
        </motion.div>
        <nav className="flex items-center gap-6 text-[15px] font-medium text-black/60">
          <Link href="/privacy" className="transition-colors hover:text-black">Privacy</Link>
          <Link href="/support" className="transition-colors hover:text-black">Support</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 sm:px-12 lg:flex-row font-rounded py-4 lg:py-6 lg:pb-12 -mt-10">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left pt-2 lg:pt-16"
        >
          <h1 className="mb-6 text-[3.5rem] leading-[1.05] tracking-tight text-black sm:text-7xl lg:text-[5.5rem]" style={{ fontWeight: 900 }}>
            Wake up to <br />
            what matters.
          </h1>
          
          <p className="mb-10 max-w-lg text-[19px] font-semibold leading-relaxed text-black/70 sm:text-[22px]">
            A friendly otter to brighten your day.
          </p>

          <Link href="https://apps.apple.com/us/app/earlyotter/id6766083287" target="_blank" className="group flex items-center justify-center rounded-2xl bg-black px-8 py-4 text-[18px] text-white shadow-lg hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-95" style={{ fontWeight: 800 }}>
            Download on the App Store
          </Link>
        </motion.div>

        {/* Right Content - App Representation */}
        <div className="relative flex flex-1 flex-col items-center justify-center lg:justify-end w-full max-w-lg mt-8 lg:mt-0">
          <div className="absolute inset-0 top-1/4 rounded-full bg-white/20 blur-[120px]" />
          
          <div className="relative w-full max-w-[330px] font-rounded z-10 mt-12 lg:mt-16">
            {/* Peeking Otter - Delay slightly to appear after card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isMounted ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              className="absolute -top-[4.4rem] right-2 w-28 h-28 z-20 pointer-events-none drop-shadow-xl"
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
              className="relative rounded-[2.5rem] border border-white/10 bg-[#1c1c1e] px-6 py-4 shadow-2xl z-10"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                   <div className="text-[18px] font-bold text-neutral-300">Next Alarm</div>
                   <Sparkles className="w-5 h-5 text-[#f59e0b] opacity-80" />
                </div>
                <div className="text-[14px] font-semibold text-neutral-400">In 11 hours, 40 minutes</div>
                
                <div className="mt-1 text-[5rem] leading-none text-white tracking-tight" style={{ fontWeight: 900 }}>
                  7:55<span className="text-[1.75rem] ml-1.5 opacity-90 font-heavy">AM</span>
                </div>
                
                <div className="mt-2 flex items-center justify-between font-bold text-neutral-400 border-t border-white/5 pt-2">
                  <span className="flex items-center gap-2 text-[14px]"><Calendar className="w-4 h-4 text-[#3b82f6]" /> Biology Class</span>
                  <span className="text-[13px]">9:00 AM</span>
                </div>
              </div>
            </motion.div>
            
            {/* Bottom Card (Weekly Pill UI) - Animated Slide Out */}
            <motion.div 
              initial={{ opacity: 0, y: -40, zIndex: 0 }}
              animate={isMounted ? { opacity: 1, y: 6, zIndex: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className="relative rounded-[2.5rem] border border-white/10 bg-[#151517] px-7 pt-4 pb-5 shadow-xl z-0 w-full"
            >
               <div className="mb-5 text-[17px] font-bold text-white px-1 mt-1">{dateInfo.title}</div>
               
               <div className="flex justify-between w-full px-1">
                  {dateInfo.days.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <span className={`text-[12px] font-bold ${item.today ? 'text-white' : 'text-neutral-500'}`}>
                        {item.day}
                      </span>
                      <div className={`relative w-[28px] sm:w-[32px] h-[190px] rounded-full border-[2px] ${item.today ? 'border-[#f59e0b] bg-[#f59e0b]/10' : 'border-[#f59e0b]/40 bg-[#f59e0b]/[0.02]'} ${item.elapsed ? 'opacity-40' : 'opacity-100'}`}>
                        {item.dots && (
                          <>
                            {item.dots.connected && (
                              <div 
                                className="absolute left-1/2 w-[2px] -translate-x-1/2 border-l-[2px] border-dashed border-[#f59e0b]/80" 
                                style={{ top: `${item.dots.top}%`, height: `${item.dots.bottom - item.dots.top}%` }}
                              />
                            )}
                            {/* Alarm Dot */}
                            <div 
                              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#151517] shadow-sm"
                              style={{ top: `${item.dots.top}%` }}
                            >
                              <div className="w-[9px] h-[9px] rounded-full bg-[#f59e0b]" />
                            </div>
                            {/* Event Dot */}
                            <div 
                              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#151517] shadow-sm"
                              style={{ top: `${item.dots.bottom}%` }}
                            >
                              <div className="w-[9px] h-[9px] rounded-full bg-[#3b82f6]" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl p-6 text-center text-[14px] font-bold text-black/40 sm:p-12 font-rounded">
        <div>© {isMounted ? new Date().getFullYear() : "2026"} EarlyOtter. All rights reserved.</div>
      </footer>
    </main>
  );
}
