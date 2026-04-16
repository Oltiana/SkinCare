"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";

export type LoginFormState = { error: string } | null;

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const callbackRaw = formData.get("callbackUrl");
  const callbackUrl =
    typeof callbackRaw === "string" && callbackRaw.startsWith("/") ? callbackRaw : "/";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
      redirect: true,
    });
  } catch (e) {
    if (isNextRedirect(e)) throw e;
    return { error: "Incorrect email or password." };
  }

  return null;
}
