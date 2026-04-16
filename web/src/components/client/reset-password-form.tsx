"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetSchema } from "@/lib/validations/auth";
import type { z } from "zod";
import { AuthCardHeader } from "./auth-card-header";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authLinkClass,
  authMutedFooterClass,
  authPrimaryButtonClass,
} from "./auth-ui";

type ResetFormValues = Omit<z.infer<typeof resetSchema>, "token">;

export function ResetPasswordForm({ initialToken }: { initialToken: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema.omit({ token: true })),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: ResetFormValues) {
    setFormError(null);
    if (!initialToken.trim()) {
      setFormError("Missing token from the link. Request a new reset link from Forgot password.");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, token: initialToken }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setFormError(data.error ?? "Reset failed.");
      return;
    }
    router.push("/login?reset=1");
    router.refresh();
  }

  if (!initialToken.trim()) {
    return (
      <div>
        <AuthCardHeader title="Reset password" />
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Use the reset link from your email, or go back and enter your email on Forgot password to get a new link.
        </p>
        <p className={`${authMutedFooterClass} !mt-8`}>
          <Link className={authLinkClass} href="/forgot-password">
            Request a new link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <AuthCardHeader title="New password" />

      <p className="mb-6 text-sm leading-relaxed text-stone-600">
        Choose a new password for your account.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className={authLabelClass} htmlFor="reset-password">
            New password
          </label>
          <input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your new password (8 or more characters, one capital letter, one symbol)"
            className={authFieldClass}
            {...register("password")}
          />
          {errors.password && <p className={authErrorClass}>{errors.password.message}</p>}
        </div>

        {formError && <p className={authErrorClass}>{formError}</p>}

        <button type="submit" disabled={isSubmitting} className={authPrimaryButtonClass}>
          {isSubmitting ? "Saving…" : "Save password"}
        </button>
      </form>

      <p className={authMutedFooterClass}>
        <Link className={authLinkClass} href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
