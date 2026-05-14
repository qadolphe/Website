import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#0a0a0a] text-[#ededed] antialiased selection:bg-[#f59e0b] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --font-rounded: ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif;
        }
        .font-rounded { font-family: var(--font-rounded); }
      `}} />

      <header className="flex w-full items-center justify-between p-6 sm:p-12 lg:p-16 font-rounded">
        <Link href="/" className="text-xl tracking-tight text-white transition-colors hover:text-[#f59e0b]" style={{ fontWeight: 900 }}>EarlyOtter</Link>
        <nav className="flex items-center gap-6 text-[15px] font-bold text-neutral-500">
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="/support" className="text-white">Support</Link>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 pb-24 sm:px-12 lg:px-16 font-rounded">
        <p className="mb-4 text-[13px] font-bold tracking-widest text-[#f59e0b] uppercase">
          Help
        </p>
        <h1 className="text-5xl leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[7rem]" style={{ fontWeight: 900 }}>
          Support.
        </h1>
        <p className="mt-8 max-w-lg text-xl font-bold leading-relaxed text-neutral-400">
          If you need help with EarlyOtter, or have questions about your alarms, please reach out to us at{" "}
          <a
            href="mailto:support@earlyotter.com"
            className="text-[#f59e0b] underline decoration-[#f59e0b]/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            support@earlyotter.com
          </a>.
        </p>
      </section>
    </main>
  );
}
