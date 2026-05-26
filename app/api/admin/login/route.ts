import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, getAdminPassword, setSessionCookie } from "@/lib/auth";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    const expected = getAdminPassword();
    if (parsed.data.password !== expected) {
      await new Promise((r) => setTimeout(r, 350));
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    const token = await createSession();
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
