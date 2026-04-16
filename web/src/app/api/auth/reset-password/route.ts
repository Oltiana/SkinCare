import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { hashResetToken } from "@/lib/server/token";
import { resetSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const tokenHash = hashResetToken(parsed.data.token);

  try {
    await connectDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const user = await User.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "This link is invalid or has expired. Request a new one." },
      { status: 400 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await User.updateOne(
    { _id: user._id },
    {
      $set: { password: passwordHash },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
    },
  );

  return NextResponse.json({ ok: true });
}
