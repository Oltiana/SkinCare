"use server";

import { redirect } from "next/navigation";
import { registerUser } from "@/lib/server/auth/register-user";
import { registerFormSchema } from "@/lib/validations/auth";

export type RegisterFormState = { error: string } | null;

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function registerAction(
  _prev: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const parsed = registerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Validation failed.";
    return { error: first };
  }

  try {
    const result = await registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (!result.ok) {
      return { error: result.error };
    }

    redirect("/login?registered=1");
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return { error: "Registration failed. Try again." };
  }

  return null;
}
