"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 500);
    return () => clearTimeout(timer);
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

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 sm:px-12 lg:flex-row font-rounded py-4 lg:py-8 lg:pb-16 -mt-8">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left pt-4 lg:pt-20"
        >
          <h1 className="mb-6 text-[3.5rem] leading-[1.05] tracking-tight text-black sm:text-7xl lg:text-[5.5rem]" style={{ fontWeight: 900 }}>
            Wake up to <br />
            what matters.
          </h1>
          
          <p className="mb-10 max-w-lg text-[19px] font-semibold leading-relaxed text-black/70 sm:text-[22px]">
            A beautiful, privacy-first smart alarm natively synced with your schedule. No more morning math.
          </p>

          <Link href="https://apps.apple.com/us/app/earlyotter/id6766083287" target="_blank" className="group flex items-center justify-center rounded-2xl bg-black px-8 py-4 text-[18px] text-white shadow-lg hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-95" style={{ fontWeight: 800 }}>
            Download on the App Store
          </Link>
        </motion.div>

        {/* Right Content - App Representation */}
        <div className="relative flex flex-1 flex-col items-center justify-center lg:justify-end w-full max-w-xl pt-16 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative w-full max-w-[520px] font-rounded z-10 flex justify-center"
          >
            <video 
              ref={videoRef}
              muted 
              playsInline
              className="w-full h-auto object-contain"
            >
              {/* Safari/Apple devices (HEVC with Alpha) */}
              <source src="/images/master_transparent-1.mov" type='video/quicktime' />
              <source src="/images/output.mp4" type='video/mp4; codecs="hvc1"' />
              {/* Chrome/Firefox/Edge (VP9 with Alpha) */}
              <source src="/images/0001-0160.webm" type="video/webm" />
            </video>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl p-6 text-center text-[14px] font-bold text-black/40 sm:p-12 font-rounded">
        <div>© {isMounted ? new Date().getFullYear() : "2026"} EarlyOtter. All rights reserved.</div>
      </footer>
    </main>
  );
}
