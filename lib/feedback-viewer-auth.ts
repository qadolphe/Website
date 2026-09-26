import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { Resource } from "sst";

export const feedbackViewerCookie = "earlyotter_feedback_viewer";
export const feedbackViewerSessionSeconds = 8 * 60 * 60;
const sessionVersion = "v1";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function matches(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

function password() {
  return Resource.FeedbackViewerPassword.value;
}

export function isFeedbackViewerPassword(candidate: string) {
  return matches(candidate, password());
}

function signature(expiresAt: number) {
  return createHmac("sha256", password())
    .update(`${sessionVersion}.${expiresAt}`)
    .digest("base64url");
}

export function feedbackViewerSessionToken() {
  const expiresAt =
    Math.floor(Date.now() / 1_000) + feedbackViewerSessionSeconds;
  return `${sessionVersion}.${expiresAt}.${signature(expiresAt)}`;
}

export function isFeedbackViewerSession(candidate: string | undefined) {
  if (!candidate) return false;

  const [version, rawExpiration, candidateSignature] = candidate.split(".");
  const expiresAt = Number(rawExpiration);
  if (
    version !== sessionVersion ||
    !candidateSignature ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1_000)
  ) {
    return false;
  }

  return matches(candidateSignature, signature(expiresAt));
}

export async function hasFeedbackViewerSession() {
  const cookieStore = await cookies();
  return isFeedbackViewerSession(cookieStore.get(feedbackViewerCookie)?.value);
}
