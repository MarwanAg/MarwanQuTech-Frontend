import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Called by the ASP.NET Core API after content changes:
 *   POST /api/revalidate   header x-revalidate-secret   body { "tags": ["projects", "project:slug", ...] }
 * Expires the matching fetch caches immediately, so the next visitor sees the new content.
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET ?? "";
  const provided = request.headers.get("x-revalidate-secret") ?? "";

  if (!expected || !safeEqual(provided, expected)) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((t): t is string => typeof t === "string" && t.length > 0 && t.length <= 300).slice(0, 50)
    : [];

  if (tags.length === 0) {
    return Response.json({ revalidated: false, message: "Body must be { tags: string[] }" }, { status: 400 });
  }

  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tags, now: Date.now() });
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
