"use server";

import { redirect } from "next/navigation";
import { resetUserPasswordWithCode } from "@/lib/server/auth/reset-password";
import { resetWithCodeFormSchema } from "@/lib/validations/auth";

export type ResetPasswordFormState = { error: string } | null;

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function resetPasswordAction(
  _prev: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const codeRaw = formData.get("code");
  const parsed = resetWithCodeFormSchema.safeParse({
    email: formData.get("email"),
    code: typeof codeRaw === "string" ? codeRaw.replace(/\s/g, "") : "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Validation failed.";
    return { error: first };
  }

  try {
    const result = await resetUserPasswordWithCode({
      email: parsed.data.email,
      code: parsed.data.code,
      password: parsed.data.password,
    });

    if (!result.ok) {
      return { error: result.error };
    }

    redirect("/login?reset=1");
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return { error: "Reset failed. Try again." };
  }

  return null;
}
