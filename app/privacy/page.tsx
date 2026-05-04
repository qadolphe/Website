export default function PrivacyPage() {
  return (
    <main className="px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 px-8 py-12 shadow-xl shadow-black/20 backdrop-blur-sm sm:px-10">
        <p className="text-sm font-medium tracking-[0.22em] text-amber-400 uppercase">
          Privacy
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          Privacy Policy for EarlyOtter
        </h1>
        <p className="mt-3 text-sm text-neutral-500">Last Updated: May 2026</p>

        <div className="mt-10 space-y-8 text-base leading-8 text-neutral-300">
          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              1. Calendar Data
            </h2>
            <p className="mt-2">
              EarlyOtter requires access to your calendar to calculate accurate
              wake-up times. All calendar data is processed strictly locally on
              your device. EarlyOtter does not transmit, store, or sell your
              calendar data to external servers or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              2. Alarms and Notifications
            </h2>
            <p className="mt-2">
              EarlyOtter utilizes local notifications and AlarmKit to schedule
              wake-up alerts. This scheduling happens entirely on your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              3. Analytics and Crash Reporting
            </h2>
            <p className="mt-2">
              We may collect standard, anonymized crash reports provided by
              Apple to help improve the stability of the application. This data
              is not linked to your personal identity or your calendar events.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              4. Contact Us
            </h2>
            <p className="mt-2">
              If you have any questions, contact{" "}
              <a
                href="mailto:support@earlyotter.com"
                className="font-medium text-amber-400 transition hover:text-amber-300"
              >
                support@earlyotter.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
