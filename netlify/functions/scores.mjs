// Paddle score service: records each player's daily score and returns the day's distribution.
// Each score is stored as its own empty blob whose key holds the day and score,
// e.g. "d12/s372/<uuid>", so simultaneous submissions never overwrite each other.
import { getStore } from "@netlify/blobs";

const LAUNCH = Date.UTC(2026, 10, 17); // Catalogue No. 1
const serverDay = () => Math.floor((Date.now() - LAUNCH) / 864e5) + 1;

export default async (req) => {
  const store = getStore("paddle-scores");

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
    const day = Number(body.day), score = Number(body.score);
    const valid = Number.isInteger(day) && Number.isInteger(score) && score >= 0 && score <= 500
      && Math.abs(day - serverDay()) <= 1;            // players in any time zone, nothing older
    if (!valid) return new Response("invalid", { status: 400 });
    await store.set(`d${day}/s${score}/${crypto.randomUUID()}`, "1");
    return Response.json({ ok: true });
  }

  const day = Number(new URL(req.url).searchParams.get("day"));
  if (!Number.isInteger(day) || day < 1) return new Response("invalid day", { status: 400 });
  const { blobs } = await store.list({ prefix: `d${day}/` });
  const hist = {};
  for (const b of blobs) {
    const s = parseInt(b.key.split("/")[1].slice(1), 10);
    if (!Number.isNaN(s)) hist[s] = (hist[s] || 0) + 1;
  }
  return Response.json({ total: blobs.length, hist },
    { headers: { "Cache-Control": "public, max-age=30" } });
};

export const config = { path: "/api/scores" };
