import { randomUUID } from "node:crypto";

import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import {
  feedbackRequestSchema,
  MAX_FEEDBACK_BODY_BYTES,
  type StoredFeedback,
} from "@/lib/feedback";
import { storeFeedback } from "@/lib/feedback-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJsonBody(request, MAX_FEEDBACK_BODY_BYTES);
  if ("error" in body) return body.error;

  const parsed = feedbackRequestSchema.safeParse(body.value);
  if (!parsed.success) return jsonError("invalid_request", 400);

  const feedback: StoredFeedback = {
    ...parsed.data,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    source: "ios",
  };

  try {
    await storeFeedback(feedback);
    return jsonOk(201);
  } catch (error) {
    console.error("Unable to store feedback", error instanceof Error ? error.name : "unknown");
    return jsonError("submission_failed", 500);
  }
}
