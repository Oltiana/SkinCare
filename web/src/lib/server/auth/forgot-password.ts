import { connectDb } from "@/lib/server/db";
import {
  canSendPasswordResetEmail,
  sendPasswordResetCodeEmail,
} from "@/lib/server/email/send-password-reset";
import { User } from "@/lib/server/models/User";
import { generateResetCode, hashResetToken } from "@/lib/server/token";
import { forgotSchema } from "@/lib/validations/auth";

const CODE_TTL_MS = 15 * 60 * 1000;

const GENERIC_SUCCESS_MESSAGE =
  "If this email is registered, we sent a 6-digit code. Check your inbox and spam folder.";

export type ForgotPasswordResult = {
  ok: true;
  message: string;
  email?: string;
  /** Dev only — when email is not sent. */
  devCode?: string;
  emailError?: string;
};

export async function requestPasswordReset(
  emailInput: string,
): Promise<{ ok: false; error: string } | ForgotPasswordResult> {
  const parsed = forgotSchema.safeParse({ email: emailInput });
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email." };
  }

  const email = parsed.data.email.toLowerCase();
  const isDev = process.env.NODE_ENV === "development";

  try {
    await connectDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return { ok: false, error: msg };
  }

  const user = await User.findOne({ email });

  if (!user) {
    if (isDev) {
      return {
        ok: true,
        message: "No account found for this email. Register first or check the spelling.",
      };
    }
    return { ok: true, message: GENERIC_SUCCESS_MESSAGE };
  }

  const code = generateResetCode();
  user.resetTokenHash = hashResetToken(code);
  user.resetTokenExpires = new Date(Date.now() + CODE_TTL_MS);
  await user.save();
  console.info("[forgot-password] Reset code for", email, "→", code);

  if (!canSendPasswordResetEmail()) {
    if (isDev) {
      return {
        ok: true,
        message:
          "RESEND_API_KEY is missing — email was not sent. Use the code below, then go to Reset password.",
        email,
        devCode: code,
        emailError: "Set RESEND_API_KEY and restart npm run dev.",
      };
    }
    return { ok: true, message: GENERIC_SUCCESS_MESSAGE };
  }

  const { sent, error } = await sendPasswordResetCodeEmail(email, code);
  if (sent) {
    return {
      ok: true,
      message: `${GENERIC_SUCCESS_MESSAGE} Enter it on the reset password page.`,
      email,
    };
  }

  console.error("[forgot-password] Email not sent:", error);

  if (isDev) {
    return {
      ok: true,
      message: "Email could not be sent. Use the code below (dev).",
      email,
      devCode: code,
      emailError: error ?? "Unknown email error",
    };
  }

  return { ok: true, message: GENERIC_SUCCESS_MESSAGE };
}
