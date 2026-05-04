export default function SupportPage() {
  return (
    <main className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 px-8 py-12 shadow-xl shadow-black/20 backdrop-blur-sm sm:px-10">
        <p className="text-sm font-medium tracking-[0.22em] text-amber-400 uppercase">
          Support
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          We&apos;re here to help
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-300">
          If you need help with EarlyOtter, or have questions about your alarms,
          please contact us at{" "}
          <a
            href="mailto:support@earlyotter.com"
            className="font-medium text-amber-400 transition hover:text-amber-300"
          >
            support@earlyotter.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
