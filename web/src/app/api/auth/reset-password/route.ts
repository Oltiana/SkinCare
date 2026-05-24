import { NextResponse } from "next/server";
import { resetUserPasswordWithCode } from "@/lib/server/auth/reset-password";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const result = await resetUserPasswordWithCode({
    email: typeof b.email === "string" ? b.email : "",
    code: typeof b.code === "string" ? b.code : "",
    password: typeof b.password === "string" ? b.password : "",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
