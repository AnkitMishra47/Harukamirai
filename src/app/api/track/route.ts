import { NextResponse } from "next/server";

/**
 * Lightweight beacon endpoint - logs resume download events.
 * In production, pipe to an analytics service; for now, server-side console log.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // eslint-disable-next-line no-console
    console.log("[track]", body);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
