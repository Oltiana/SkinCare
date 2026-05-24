"use server";

import { requestPasswordReset } from "@/lib/server/auth/forgot-password";

export type ForgotPasswordFormState = {
  error?: string;
  message?: string;
  email?: string;
  devCode?: string;
  emailError?: string;
} | null;

export async function forgotPasswordAction(
  _prev: ForgotPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  const emailRaw = formData.get("email");
  const email = typeof emailRaw === "string" ? emailRaw : "";

  const result = await requestPasswordReset(email);

  if (!result.ok) {
    return { error: result.error };
  }

  return {
    message: result.message,
    email: result.email,
    devCode: result.devCode,
    emailError: result.emailError,
  };
}
