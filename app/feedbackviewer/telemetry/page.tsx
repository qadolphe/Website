import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { hasFeedbackViewerSession } from "@/lib/feedback-viewer-auth";
import { summarize, type Breakdown } from "@/lib/telemetry-metrics";
import { listInstalls } from "@/lib/telemetry-store";

import { signOut } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Telemetry | EarlyOtter",
  robots: { index: false, follow: false },
};

type TelemetryPageProps = {
  searchParams: Promise<{ channel?: string }>;
};

const percent = (value: number | null) =>
  value === null ? "—" : `${Math.round(value * 100)}%`;
const share = (count: number, total: number) =>
  total === 0 ? "—" : `${Math.round((count / total) * 100)}%`;

export default async function TelemetryPage({ searchParams }: TelemetryPageProps) {
  if (!(await hasFeedbackViewerSession())) redirect("/feedbackviewer");

  // Debug and TestFlight installs are hidden unless explicitly requested.
  const showAllBuilds = (await searchParams).channel === "all";
  const installs = (await listInstalls()).filter(
    (install) => showAllBuilds || install.channel === "appstore",
  );
  const summary = summarize(installs);

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] px-6 py-10 text-[#ededed] antialiased sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#f59e0b]">
              EarlyOtter
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Telemetry</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/feedbackviewer"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white"
            >
              Feedback
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </header>

        <nav className="mb-8 flex gap-2">
          {[
            { label: "App Store", href: "/feedbackviewer/telemetry", isActive: !showAllBuilds },
            { label: "All builds", href: "/feedbackviewer/telemetry?channel=all", isActive: showAllBuilds },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                tab.isActive
                  ? "bg-[#f59e0b] text-black"
                  : "border border-neutral-700 text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {summary.installs === 0 ? (
          <Card>
            <p className="text-neutral-400">No installs have reported yet.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <Stat label="Installs" value={summary.installs} />
              <Stat label="Opened in last 7 days" value={summary.opened7d} />
              <Stat label="Opened in last 30 days" value={summary.opened30d} />
              <Stat label="Alarm active in last 7 days" value={summary.activeAlarms7d} accent />
            </div>

            <Card title="Activation funnel">
              <div className="space-y-3">
                {summary.funnel.map((step, index) => {
                  const previous = index === 0 ? step.count : summary.funnel[index - 1].count;
                  return (
                    <div key={step.label}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-semibold text-neutral-200">{step.label}</span>
                        <span className="tabular-nums text-neutral-400">
                          {step.count} · {share(step.count, summary.installs)}
                          {index > 0 && (
                            <span className="ml-2 text-neutral-600">
                              ({share(step.count, previous)} of previous)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-neutral-800">
                        <div
                          className="h-2.5 rounded-full bg-[#f59e0b]"
                          style={{ width: `${(step.count / summary.installs) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Retention by first-open week">
              <Table
                headers={["Week of", "Installs", "Returned day 1", "Active days 7–13", "Active days 30–59"]}
                rows={summary.retention.map((c) => [
                  c.week,
                  String(c.installs),
                  percent(c.day1),
                  percent(c.week2),
                  percent(c.day30),
                ])}
              />
              <p className="mt-3 text-xs text-neutral-600">
                — means the cohort is too recent to measure.
              </p>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card title="Permissions">
                <Table
                  headers={["Permission", "Granted", "Ever denied"]}
                  rows={summary.permissions.map((p) => [
                    p.kind[0].toUpperCase() + p.kind.slice(1),
                    String(p.granted),
                    String(p.denied),
                  ])}
                />
              </Card>
              <Card title="Features">
                <Table
                  headers={["Feature", "Installs", "Times"]}
                  rows={summary.features.map((f) => [f.label, String(f.installs), String(f.total)])}
                />
              </Card>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <BreakdownCard title="App versions" data={summary.versions} />
              <BreakdownCard title="Countries" data={summary.countries} />
              <BreakdownCard title="Calendar providers" data={summary.providers} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      {title && <h2 className="mb-4 text-lg font-black tracking-tight">{title}</h2>}
      {children}
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-sm font-semibold text-neutral-400">{label}</p>
      <p className={`mt-2 text-3xl font-black tabular-nums ${accent ? "text-[#f59e0b]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-neutral-500">
            {headers.map((h) => (
              <th key={h} className="pb-2 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums text-neutral-200">
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-neutral-800">
              {row.map((cell, i) => (
                <td key={i} className="py-2 pr-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BreakdownCard({ title, data }: { title: string; data: Breakdown }) {
  return (
    <Card title={title}>
      {data.length === 0 ? (
        <p className="text-sm text-neutral-500">None yet.</p>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {data.slice(0, 10).map((d) => (
            <li key={d.label} className="flex justify-between">
              <span className="text-neutral-200">{d.label}</span>
              <span className="tabular-nums text-neutral-400">{d.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
