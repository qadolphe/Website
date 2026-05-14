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
              1. General Calendar Data & Notifications
            </h2>
            <p className="mt-2">
              EarlyOtter requires access to your calendar to calculate accurate
              wake-up times. All calendar data is processed strictly locally on
              your device. EarlyOtter utilizes local notifications and AlarmKit to schedule
              wake-up alerts entirely on your device. EarlyOtter does not transmit, store, or sell your
              calendar data to external servers or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              2. Google User Data Accessed
            </h2>
            <p className="mt-2">
              EarlyOtter requests access to your Google Calendar data. Specifically, the application reads the start times of your scheduled events to calculate accurate wake-up times.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              3. Data Usage
            </h2>
            <p className="mt-2">
              The Google Calendar data accessed by EarlyOtter is used exclusively to calculate and schedule local wake-up alarms on your device based on your earliest morning events and your configured preparation time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              4. Data Storage & Protection
            </h2>
            <p className="mt-2">
              All Google user data is processed and stored strictly locally on your Apple device. EarlyOtter has no external backend servers or databases. Your calendar data never leaves your device and is protected by iOS&apos;s standard sandbox security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              5. Data Sharing
            </h2>
            <p className="mt-2">
              EarlyOtter does not share, transfer, or sell your Google user data to any third parties, advertising networks, or external services under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              6. Data Retention & Deletion
            </h2>
            <p className="mt-2">
              Because data is only stored locally, your Google Calendar data is retained only as long as you keep the app installed and your account connected. You can permanently delete this data at any time by disconnecting your Google account within the app&apos;s settings or by uninstalling the EarlyOtter application from your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              7. Google API Services User Data Policy (Limited Use)
            </h2>
            <p className="mt-2">
              EarlyOtter&apos;s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              8. Analytics and Crash Reporting
            </h2>
            <p className="mt-2">
              We may collect standard, anonymized crash reports provided by
              Apple to help improve the stability of the application. This data
              is not linked to your personal identity or your calendar events.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-100">
              9. Contact Us
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
