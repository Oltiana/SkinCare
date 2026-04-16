import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { roleForNewUser } from "@/lib/server/auth/roles";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;

  try {
    await connectDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  await User.create({
    email: email.toLowerCase(),
    password: passwordHash,
    name: name || "",
    role: roleForNewUser(email.toLowerCase()),
  });

  return NextResponse.json({ ok: true });
}
