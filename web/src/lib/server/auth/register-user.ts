import { hash } from "bcryptjs";
import { roleForNewUser } from "@/lib/server/auth/roles";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { registerSchema } from "@/lib/validations/auth";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed." };
  }

  const { email, password, name } = parsed.data;

  try {
    await connectDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return { ok: false, error: msg };
  }

  const normalized = email.toLowerCase();
  const existing = await User.findOne({ email: normalized });
  if (existing) {
    return { ok: false, error: "This email is already registered" };
  }

  const passwordHash = await hash(password, 12);
  await User.create({
    email: normalized,
    password: passwordHash,
    name: name || "",
    role: roleForNewUser(normalized),
  });

  return { ok: true };
}
