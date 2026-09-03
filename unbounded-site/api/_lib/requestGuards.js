// Shared abuse-protection for the signed-out-friendly /api/ask endpoint.
// Same idea as the Softly Thrivin analyse-* guards: an origin check plus a
// per-IP rate limit, so a public endpoint that costs an Anthropic call each
// time can't be looped by a bare script.

function hostOf(value) {
  try { return new URL(value).host; } catch { return null; }
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

// Allow the real site (apex + www) and Vercel preview URLs. Anything else,
// or a request with no Origin/Referer at all, is rejected. Kept permissive
// on purpose: the front end falls back gracefully if this ever blocks, so
// erring toward "let real visitors through" is the safe choice here.
export function isAllowedOrigin(req) {
  const host = hostOf(req.headers.origin) || hostOf(req.headers.referer);
  if (!host) return false;
  return (
    host === "unboundedspac3s.com" ||
    host === "www.unboundedspac3s.com" ||
    host.endsWith(".vercel.app")
  );
}

// In-memory, per-instance sliding window. Not distributed, but it blunts the
// common tight-loop abuse without a new datastore.
const hits = new Map();
const MAX_MAP_ENTRIES = 5000;

export function isRateLimited(key, { windowMs = 60_000, max = 12 } = {}) {
  const now = Date.now();
  const bucketKey = key || "unknown";
  const timestamps = (hits.get(bucketKey) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(bucketKey, timestamps);
  if (hits.size > MAX_MAP_ENTRIES) hits.delete(hits.keys().next().value);
  return timestamps.length > max;
}
