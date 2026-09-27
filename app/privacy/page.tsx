import Link from "next/link";

export default function PrivacyPage() {
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
          <Link href="/privacy" className="text-white">Privacy</Link>
          <Link href="/support" className="transition-colors hover:text-white">Support</Link>
        </nav>
      </header>

      <article className="mx-auto w-full max-w-4xl px-6 pb-24 sm:px-12 lg:px-16 font-rounded">
        <div className="mb-16 border-b border-neutral-800 pb-16">
          <p className="mb-4 text-[13px] font-bold tracking-widest text-[#f59e0b] uppercase">
            Legal
          </p>
          <h1 className="text-5xl leading-[1.05] tracking-tight text-white sm:text-7xl" style={{ fontWeight: 900 }}>
            Privacy.
          </h1>
          <p className="mt-6 text-lg font-bold text-neutral-500">Last Updated: September 2026</p>
        </div>

        <div className="space-y-12 text-lg font-medium leading-relaxed text-neutral-400">
          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>1. General Calendar Data & Notifications</h2>
            <p>EarlyOtter requires access to your calendar to calculate accurate wake-up times. All calendar data is processed strictly locally on your device. EarlyOtter utilizes local notifications and AlarmKit to schedule wake-up alerts entirely on your device. EarlyOtter does not transmit, store, or sell your calendar data to external servers or third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>2. Google User Data Accessed</h2>
            <p>EarlyOtter requests access to your Google Calendar data. Specifically, the application reads your events&apos; start times, titles, and locations, which it uses to calculate wake-up times, apply the rules you set up, and label each alarm with its event.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>3. Data Usage</h2>
            <p>The Google Calendar data accessed by EarlyOtter is used exclusively to calculate and schedule local wake-up alarms on your device based on your earliest morning events and your configured preparation time.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>4. Data Storage & Protection</h2>
            <p>All Google user data is processed and stored strictly locally on your Apple device. Your calendar data never leaves your device and is protected by iOS&apos;s standard sandbox security. EarlyOtter&apos;s optional feedback and anonymous usage data are separate and never include calendar data.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>5. Data Sharing</h2>
            <p>EarlyOtter does not share, transfer, or sell your Google user data to any third parties, advertising networks, or external services under any circumstances.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>6. Data Retention & Deletion</h2>
            <p>Your Google Calendar data is retained only as long as you keep the app installed and your account connected. You can permanently delete it by disconnecting your Google account or uninstalling EarlyOtter. Optional feedback is retained for up to 12 months. To request its deletion, contact us with enough detail to identify the submission.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>7. Google API Services</h2>
            <p>EarlyOtter&apos;s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>8. Analytics and Crash Reporting</h2>
            <p>We may collect standard, anonymized crash reports provided by Apple to help improve the stability of the application. This data is not linked to your personal identity or your calendar events.</p>
            <p className="mt-4">EarlyOtter also sends anonymous usage events to EarlyOtter&apos;s own servers, hosted on Amazon Web Services, so we can see whether the app works as intended. Examples include finishing setup, whether a permission was granted, how many alarms are scheduled, and which features were used. Each install is identified only by a random ID created by the app, which is not linked to your Apple ID, Google account, or device identifiers. Events never include calendar event titles, times, locations, attendees, or account details. Your IP address is never stored. Usage data is kept for up to 400 days after your last activity. It is never sold or shared with third parties. You can turn it off at any time in the app under Settings → Permissions → Share Usage Data.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>9. Optional Feedback</h2>
            <p>Submitting feedback is voluntary. If you choose to send feedback, EarlyOtter saves the category and message you provide along with the app version, build number, and iOS version. We do not include calendar data, account details, or device identifiers. Feedback is stored privately using Amazon Web Services and used only to support and improve EarlyOtter.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl tracking-tight text-white" style={{ fontWeight: 800 }}>10. Contact Us</h2>
            <p>If you have any questions, contact <a href="mailto:support@earlyotter.com" className="text-[#f59e0b] hover:text-white transition-colors">support@earlyotter.com</a>.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
