import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/server/auth/forgot-password";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email)
      : "";

  const result = await requestPasswordReset(email);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: result.message,
    email: result.email,
    devCode: result.devCode,
  });
}
