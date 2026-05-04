import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center rounded-3xl border border-white/10 bg-white/5 px-8 py-16 text-center shadow-2xl shadow-amber-500/10 backdrop-blur-sm sm:px-12">
        <div className="mb-6 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-sm font-medium tracking-[0.24em] text-amber-400 uppercase">
          Coming Soon
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          EarlyOtter
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-400 sm:text-xl">
          Your morning schedule, perfectly synced.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="#"
            aria-disabled="true"
            className="inline-flex min-w-48 items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-neutral-950 shadow-[0_0_30px_rgba(245,158,11,0.35)] transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            Join the Beta
          </Link>
          <div className="text-sm text-neutral-500">
            Privacy-first alarms for busy mornings.
          </div>
        </div>
        <div className="mt-12 flex items-center gap-6 text-sm text-neutral-500">
          <Link href="/privacy" className="transition hover:text-amber-400">
            Privacy Policy
          </Link>
          <Link href="/support" className="transition hover:text-amber-400">
            Support
          </Link>
        </div>
      </div>
    </main>
  );
}
