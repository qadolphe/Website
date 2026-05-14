import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col lg:flex-row bg-[#0a0a0a] text-[#ededed] antialiased selection:bg-[#f59e0b] selection:text-black">
      {/* 
        Applying the thick rounded font from Apple's design system matching your app:
        .font(.system(size: 46, weight: .heavy, design: .rounded)) 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-rounded: ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif;
        }
        .font-rounded { font-family: var(--font-rounded); }
      `}} />

      {/* Left Content Half */}
      <div className="flex w-full lg:w-1/2 flex-col justify-between p-6 sm:p-12 lg:p-16 font-rounded">
        <header className="flex w-full items-center justify-between">
          <div className="text-xl tracking-tight text-white" style={{ fontWeight: 900 }}>EarlyOtter</div>
          <nav className="flex items-center gap-6 text-[15px] font-bold text-neutral-500">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/support" className="transition-colors hover:text-white">Support</Link>
          </nav>
        </header>

        <section className="my-auto py-16">
          <h1 className="mb-8 text-5xl leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[7.5rem]" style={{ fontWeight: 900 }}>
            Own your <br />
            morning.
          </h1>
          
          <p className="mb-12 max-w-md text-lg font-bold leading-relaxed text-neutral-400 sm:text-xl">
            A beautifully simple, privacy-first smart alarm natively synced with your schedule. No gimmicks, just clarity.
          </p>

          <form action="#" className="flex w-full max-w-md flex-col gap-4 sm:flex-row sm:gap-0">
            <input 
              type="email"
              placeholder="name@example.com"
              required
              className="flex-1 rounded-none border-b border-neutral-700 bg-transparent py-4 text-white placeholder-neutral-600 transition-colors focus:border-white focus:outline-none focus:ring-0 sm:pr-4"
              style={{ fontWeight: 700 }}
            />
            <button 
              type="submit"
              className="group flex flex-none items-center justify-between bg-white px-6 py-4 text-[17px] text-black transition-transform hover:scale-[1.02] active:scale-100"
              style={{ fontWeight: 900 }}
            >
              <span>Join Waitlist</span>
              <svg className="ml-4 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </section>

        <footer className="mt-auto flex w-full flex-col justify-between gap-4 text-[13px] font-bold text-neutral-600 sm:flex-row">
          <div>© {new Date().getFullYear()} EarlyOtter. All rights reserved.</div>
          <div className="uppercase tracking-widest text-[#f59e0b]">Invite Only</div>
        </footer>
      </div>

      {/* Right Image Half */}
      <div className="relative w-full h-[50vh] lg:h-auto lg:flex lg:w-1/2 bg-[#050505] overflow-hidden border-t border-neutral-900 lg:border-t-0 lg:border-l">
        {/* Main Background Image */}
        <div className="relative h-full w-full opacity-90 transition-opacity hover:opacity-100">
          <Image 
            src="/images/OtterSwim.png" 
            alt="Cute otter swimming in the stars" 
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Peeking Otter floating over the page bottom right */}
        <div className="absolute bottom-0 right-8 lg:right-16 w-32 h-32 lg:w-48 lg:h-48 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-6 transition-transform duration-500 hover:translate-y-0 cursor-pointer">
          <Image 
            src="/images/OtterOverlook.png" 
            alt="Cute otter peeking over" 
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </main>
  );
}
