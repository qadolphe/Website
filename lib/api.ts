import "server-only";

export function jsonError(error: string, status: number) {
  return Response.json(
    { ok: false, error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export function jsonOk(status: number) {
  return Response.json(
    { ok: true },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Reads a JSON request body no larger than `maxBytes`. Returns the parsed value,
 * or a ready-made error response for the wrong content type, an oversized body
 * or invalid JSON.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<{ value: unknown } | { error: Response }> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return { error: jsonError("unsupported_media_type", 415) };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { error: jsonError("payload_too_large", 413) };
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > maxBytes) {
    return { error: jsonError("payload_too_large", 413) };
  }

  try {
    return { value: JSON.parse(body) };
  } catch {
    return { error: jsonError("invalid_request", 400) };
  }
}
