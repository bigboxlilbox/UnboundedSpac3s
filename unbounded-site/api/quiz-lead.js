import { getClientIp, isAllowedOrigin, isRateLimited } from "./_lib/requestGuards.js";

// Captures clarity-quiz submissions. Today it logs them (visible in Vercel
// function logs). Once Google Workspace is verified, this is where we email
// hello@unboundedspac3s.com and append a row to a Google Sheet.
export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "method not allowed" }); }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "forbidden" });
  if (isRateLimited(getClientIp(req), { max: 20 })) return res.status(429).json({ error: "too many requests" });
  const { email, answers, result } = req.body ?? {};
  console.log("[quiz-lead]", JSON.stringify({ email, answers, result, at: new Date().toISOString() }));
  return res.status(200).json({ ok: true });
}
