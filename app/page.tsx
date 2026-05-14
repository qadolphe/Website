import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-between bg-[#111111] text-[#ededed] antialiased selection:bg-[#f59e0b] selection:text-black overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-rounded: ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif;
        }
        .font-rounded { font-family: var(--font-rounded); }
      `}} />

      {/* Subtle swimming otter background image completely washed out */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-screen pointer-events-none">
        <Image 
          src="/images/OtterSwim.png" 
          alt="Stars background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111] z-0 pointer-events-none" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6 sm:px-12 sm:py-8 font-rounded">
        <div className="flex items-center gap-3">
          <div className="text-2xl tracking-tight text-[#f59e0b]" style={{ fontWeight: 900 }}>EarlyOtter</div>
        </div>
        <nav className="flex items-center gap-6 text-[15px] font-medium text-neutral-400">
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <Link href="/support" className="transition-colors hover:text-white">
            Support
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-16 px-6 sm:px-12 lg:flex-row font-rounded py-12 lg:py-20 lg:pb-32">
        {/* Left Content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left pt-4 lg:pt-0">
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
        </div>

        {/* Right Content - App Representation mimicking iOS App UI */}
        <div className="relative flex flex-1 flex-col items-center justify-center lg:justify-end w-full max-w-lg pt-16 lg:pt-0">
          {/* Ambient Glow */}
          <div className="absolute inset-0 top-1/4 rounded-full bg-[#f59e0b]/15 blur-[120px]" />
          
          {/* iOS Style Stacked Cards */}
          <div className="relative w-full max-w-[380px] font-rounded z-10">
            {/* Peeking Otter Image */}
            <div className="absolute -top-[5.1rem] right-4 w-32 h-32 z-20 transition-transform duration-500 hover:-translate-y-2 pointer-events-none drop-shadow-xl">
              <Image 
                src="/images/OtterOverlook.png" 
                alt="Cute otter peeking over" 
                fill
                className="object-contain object-bottom"
              />
            </div>

            {/* Top Card (Next Alarm) */}
            <div className="relative rounded-[2.5rem] border border-white/10 bg-[#1c1c1e] p-7 shadow-2xl z-10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                   <div className="text-[20px] font-bold text-neutral-300">Next Alarm</div>
                   <span className="text-[#f59e0b] opacity-80">✨</span>
                </div>
                <div className="mt-1 text-[15px] font-semibold text-neutral-400">In 9 hours, 46 minutes</div>
                
                <div className="mt-3 text-[5.5rem] leading-none text-white tracking-tight" style={{ fontWeight: 900 }}>
                  7:25<span className="text-[2rem] ml-1.5 opacity-90">AM</span>
                </div>
                
                <div className="mt-5 flex items-center justify-between font-bold text-neutral-400 border-t border-white/5 pt-4">
                  <span className="flex items-center gap-2 text-[15px]"><span className="text-[#f59e0b]">📅</span> English Class</span>
                  <span className="text-[14px]">8:30 AM</span>
                </div>
              </div>
            </div>
            
            {/* Bottom Card (Applied Rule) */}
            <div className="relative mt-4 rounded-[2.5rem] border border-white/10 bg-[#151517] p-7 shadow-xl z-0">
               <div className="mb-2 text-[13px] font-bold uppercase tracking-wider text-neutral-400">Applied Rule</div>
               <div className="mb-5 text-[26px] text-white" style={{ fontWeight: 900 }}>Class</div>
               
               <div className="flex flex-col gap-4 text-[16px] font-bold text-neutral-400 bg-[#2c2c2e]/30 rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                     <div className="flex flex-col">
                        <span className="flex items-center gap-2 text-white"><span className="text-[#f59e0b]">⏰</span> Wake Time</span>
                        <span className="text-[12px] font-semibold mt-1 ml-7">Default • Snooze 10m</span>
                     </div>
                     <span className="text-white text-[18px]">7:25 AM</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                     <span className="flex items-center gap-2"><span className="text-neutral-500 grayscale brightness-200">☕️</span> Prep Time</span>
                     <span>35m</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="flex items-center gap-2"><span className="text-neutral-500 grayscale brightness-200">🚗</span> Commute</span>
                     <span>30m</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl p-6 text-center text-[14px] font-bold text-neutral-600 sm:p-12 font-rounded">
        <div>© {new Date().getFullYear()} EarlyOtter. All rights reserved.</div>
      </footer>
    </main>
  );
}
