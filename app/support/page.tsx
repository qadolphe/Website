import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#070c1a] text-[#eef0f4] antialiased selection:bg-[#f4c66a] selection:text-[#070c1a]">

      <header className="flex w-full items-center justify-between p-6 sm:p-12 lg:p-16 font-rounded">
        <Link href="/" className="text-xl tracking-tight text-white transition-colors hover:text-[#f4c66a]" style={{ fontWeight: 900 }}>EarlyOtter</Link>
        <nav className="flex items-center gap-6 text-[15px] font-bold text-[#8390a8]">
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="/support" className="text-white">Support</Link>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 pb-24 sm:px-12 lg:px-16 font-rounded">
        <p className="mb-4 text-[13px] font-bold tracking-widest text-[#f4c66a] uppercase">
          Help
        </p>
        <h1 className="text-5xl leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[7rem]" style={{ fontWeight: 900 }}>
          Support.
        </h1>
        <p className="mt-8 max-w-lg text-xl font-bold leading-relaxed text-[#a6b2c8]">
          If you need help with EarlyOtter, or have questions about your alarms, please reach out to us at{" "}
          <a
            href="mailto:support@earlyotter.com"
            className="text-[#f4c66a] underline decoration-[#f4c66a]/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            support@earlyotter.com
          </a>.
        </p>
      </section>
    </main>
  );
}
