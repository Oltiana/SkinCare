import { hash } from "bcryptjs";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { hashResetToken } from "@/lib/server/token";
import { resetSchema } from "@/lib/validations/auth";

export async function resetUserPasswordWithCode(input: {
  email: string;
  code: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = resetSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { ok: false, error: first };
  }

  const email = parsed.data.email.toLowerCase();
  const codeHash = hashResetToken(parsed.data.code);

  try {
    await connectDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return { ok: false, error: msg };
  }

  const user = await User.findOne({
    email,
    resetTokenHash: codeHash,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return {
      ok: false,
      error: "Invalid or expired code. Request a new code from Forgot password.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await User.updateOne(
    { _id: user._id },
    {
      $set: { password: passwordHash },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
    },
  );

  return { ok: true };
}
