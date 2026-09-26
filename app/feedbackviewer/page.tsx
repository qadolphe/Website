import type { Metadata } from "next";
import Link from "next/link";

import type { StoredFeedback } from "@/lib/feedback";
import { listFeedback } from "@/lib/feedback-store";
import { hasFeedbackViewerSession } from "@/lib/feedback-viewer-auth";

import { signIn, signOut } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Feedback | EarlyOtter",
  robots: { index: false, follow: false },
};

const categoryLabels: Record<StoredFeedback["category"], string> = {
  experience: "Experience",
  suggestion: "Suggestion",
  issue: "Issue",
};

type FeedbackViewerPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function FeedbackViewerPage({
  searchParams,
}: FeedbackViewerPageProps) {
  if (!(await hasFeedbackViewerSession())) {
    const { error } = await searchParams;
    return <SignInPage hasError={error === "invalid"} />;
  }

  const feedback = await listFeedback();

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] px-6 py-10 text-[#ededed] antialiased sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#f59e0b]">
              EarlyOtter
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Feedback</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/feedbackviewer/telemetry"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white"
            >
              Telemetry
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

        {feedback.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-neutral-400">
            No feedback yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-[#f59e0b]/15 px-3 py-1 font-bold text-[#f59e0b]">
                    {categoryLabels[entry.category]}
                  </span>
                  <time className="text-neutral-500" dateTime={entry.submittedAt}>
                    {new Date(entry.submittedAt).toLocaleString()}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words text-[17px] leading-relaxed text-neutral-200">
                  {entry.message}
                </p>
                <p className="mt-4 text-sm text-neutral-500">
                  App {entry.appVersion} ({entry.buildNumber}) · iOS{" "}
                  {entry.iosVersion}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SignInPage({ hasError }: { hasError: boolean }) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a] px-6 text-[#ededed] antialiased">
      <div className="w-full max-w-sm rounded-3xl border border-neutral-800 bg-neutral-900 p-7">
        <p className="text-sm font-bold uppercase tracking-widest text-[#f59e0b]">
          EarlyOtter
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Feedback</h1>
        <form action={signIn} className="mt-7 space-y-4">
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              placeholder="Password"
              className="w-full rounded-xl border border-neutral-700 bg-[#111] px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-[#f59e0b]"
            />
          </label>
          {hasError && (
            <p className="text-sm font-semibold text-red-400">
              Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#f59e0b] px-4 py-3 font-bold text-black transition hover:bg-[#fbbf24]"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
