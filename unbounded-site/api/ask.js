import { getClientIp, isAllowedOrigin, isRateLimited } from "./_lib/requestGuards.js";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are the friendly intake guide on the Unbounded Spac3s website, a UK shop selling ready-made, editable Word document templates for founders across seven sectors: Beauty & Hair, Creatives, Events, Food & Hospitality, Trades & Property, Online & Coaching, and Core Essentials (the cross-business foundations any new business needs).

A visitor has told you their stage and described their business or what's on their mind. Do three things: judge how well one of our packs really fits, choose the best sector, and write a warm, genuinely useful reply in a plain, encouraging, no-jargon British voice.

Judging fit (be honest, this matters more than making a sale):
- "strong" = they clearly fit one sector and a pack would genuinely help (a nail tech, an electrician, a coach, a caterer).
- "weak" = the request is niche, complex, spans several areas, is really about strategy or a big life/business decision, or no single pack honestly answers it. Use a sensible middle: only mark weak when the fit is genuinely poor, not just because they are unsure of the sector.

Rules for the reply:
- One or two short sentences. Warm and human, never corporate.
- If fit is strong: give one specific, useful insight tied to what they wrote, then it points naturally at the pack.
- If fit is weak: gently say this is one worth talking through, and that a pack may help with parts of it but won't be the full picture. Do not oversell.
- Never use en dashes or em dashes. Use commas or full stops only.
- Do not invent facts, quote prices, or make promises.

Choose "sector" as the closest fit from: beauty, trades, food, events, creatives, online, core. Use "core" if they are just starting, unsure, or do not clearly fit one sector.

Return ONLY valid JSON, no markdown, no preamble:
{ "sector": "one of the seven keys", "fit": "strong or weak", "reply": "your one or two sentence reply" }`;

function stripMarkdownFence(text) {
  return text.trim().replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\`\`\`\s*$/, "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "forbidden" });
  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ error: "too many requests, please slow down" });
  }

  const { message, stage } = req.body ?? {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "missing or invalid 'message' field" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "intake is not configured" });

  const userMessage = `Stage: ${stage || "not sure"}.\nWhat they said: ${message}`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) return res.status(502).json({ error: "failed to reach the guide" });

    const data = await response.json();
    const text = data.content?.find((b) => b.type === "text")?.text;
    if (!text) return res.status(502).json({ error: "the guide returned no result" });

    let parsed;
    try { parsed = JSON.parse(stripMarkdownFence(text)); }
    catch { return res.status(502).json({ error: "failed to read the guide's reply" }); }

    const allowed = ["beauty","trades","food","events","creatives","online","core"];
    const sector = allowed.includes(parsed.sector) ? parsed.sector : "core";
    const fit = parsed.fit === "weak" ? "weak" : "strong";
    return res.status(200).json({ sector, fit, reply: parsed.reply ?? "" });
  } catch {
    return res.status(502).json({ error: "failed to reach the guide" });
  }
}
