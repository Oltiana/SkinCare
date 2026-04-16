import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { generateRawResetToken, hashResetToken } from "@/lib/server/token";
import { forgotSchema } from "@/lib/validations/auth";

/** Canonical site URL for reset links. Falls back to this request’s origin (correct dev port). */
function passwordResetBaseUrl(req: Request): string {
  const env = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (env) return env.replace(/\/+$/, "");
  try {
    return new URL(req.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await connectDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const user = await User.findOne({ email });
  const base = passwordResetBaseUrl(req);
  let resetLink: string | undefined;

  if (user) {
    const raw = generateRawResetToken();
    user.resetTokenHash = hashResetToken(raw);
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    resetLink = `${base}/reset-password?token=${encodeURIComponent(raw)}`;
    console.info("[forgot-password] Reset link for", email, "→", resetLink);
  }

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "No account found for this email. Register first or check the spelling.",
      });
    }
    return NextResponse.json({
      ok: true,
      message: "Account found. Open the link below to set a new password (dev only — use email in production).",
      resetLink,
    });
  }

  return NextResponse.json({
    ok: true,
    message:
      "If this email is registered, you will receive instructions to reset your password. Check your inbox.",
  });
}
