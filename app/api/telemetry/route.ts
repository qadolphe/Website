import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import { MAX_TELEMETRY_BODY_BYTES, telemetryBatchSchema } from "@/lib/telemetry";
import { recordTelemetryBatch } from "@/lib/telemetry-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJsonBody(request, MAX_TELEMETRY_BODY_BYTES);
  if ("error" in body) return body.error;

  const parsed = telemetryBatchSchema.safeParse(body.value);
  if (!parsed.success) return jsonError("invalid_request", 400);

  // Country code only; the viewer's IP address is never read or stored.
  const country = request.headers.get("cloudfront-viewer-country")?.trim().toUpperCase();

  try {
    await recordTelemetryBatch(
      parsed.data,
      country && /^[A-Z]{2}$/.test(country) ? country : undefined,
    );
    return jsonOk(202);
  } catch (error) {
    console.error("Unable to record telemetry", error instanceof Error ? error.name : "unknown");
    return jsonError("submission_failed", 500);
  }
}
