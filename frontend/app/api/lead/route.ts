import type { NextRequest } from "next/server";
import { isValidPhoneNumber } from "libphonenumber-js";

type LeadSource = "contact" | "quote" | "newsletter";

type LeadBody = {
  source?: LeadSource;
  name?: string;
  phone?: string;
  message?: string;
  locale?: string;
  page?: string;
};

const rateWindowMs = 60_000;
const maxPerWindow = 5;
const recent = new Map<string, number[]>();

function getClientKey(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeMdV2(s: string): string {
  return s.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

/** Inside a MarkdownV2 link target only ')' and '\' need escaping. */
function escapeMdV2Url(s: string): string {
  return s.replace(/([)\\])/g, "\\$1");
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < rateWindowMs);
  if (hits.length >= maxPerWindow) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  return false;
}

/**
 * Kept deliberately short: the manager reads these on a phone and needs the
 * name, a tappable number and the note — nothing else competing for attention.
 * The phone goes on its own line as a tel: link so it dials in one tap.
 */
function buildMessage(body: LeadBody): string {
  const lines: string[] = [];

  if (body.name) lines.push(`*${escapeMdV2(body.name)}*`);
  if (body.phone) {
    const dial = body.phone.replace(/[^\d+]/g, "");
    lines.push(`[${escapeMdV2(body.phone)}](tel:${escapeMdV2Url(dial)})`);
  }
  if (body.message) lines.push("", escapeMdV2(body.message));

  return lines.join("\n");
}

async function sendToTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error("Telegram credentials not configured");
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const data = await res.text();
    throw new Error(`Telegram API error: ${res.status} ${data}`);
  }
}

export async function POST(request: NextRequest) {
  const key = getClientKey(request);
  if (isRateLimited(key)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const source: LeadSource = body.source ?? "contact";
  if (!["contact", "quote", "newsletter"].includes(source)) {
    return Response.json(
      { ok: false, error: "invalid_source" },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (!name) {
    return Response.json({ ok: false, error: "missing_name" }, { status: 400 });
  }
  if (!phone || !isValidPhoneNumber(phone)) {
    return Response.json(
      { ok: false, error: "invalid_phone" },
      { status: 400 },
    );
  }

  const safe: LeadBody = {
    source,
    name: name.slice(0, 120),
    phone: phone.slice(0, 40),
    message: body.message?.slice(0, 2000),
    locale: body.locale?.slice(0, 8),
    page: body.page?.slice(0, 200),
  };

  try {
    await sendToTelegram(buildMessage(safe));
    return Response.json({ ok: true });
  } catch (err) {
    console.error("telegram send failed", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
