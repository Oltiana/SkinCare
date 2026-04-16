"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotSchema } from "@/lib/validations/auth";
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

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [info, setInfo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotValues) {
    setFormError(null);
    setInfo(null);
    setResetLink(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { error?: string; message?: string; ok?: boolean; resetLink?: string };
    if (!res.ok) {
      setFormError(data.error ?? "Request failed.");
      return;
    }
    setInfo(data.message ?? "If this email is registered, check for reset instructions.");
    if (typeof data.resetLink === "string" && data.resetLink.length > 0) {
      setResetLink(data.resetLink);
    }
  }

  return (
    <div>
      <AuthCardHeader title="Reset password" />

      <p className="mb-6 text-sm leading-relaxed text-stone-600">
        Enter the email you used to register. You&apos;ll get a link to choose a new password.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className={authLabelClass} htmlFor="forgot-email">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={authFieldClass}
            {...register("email")}
          />
          {errors.email && <p className={authErrorClass}>{errors.email.message}</p>}
        </div>

        {formError && <p className={authErrorClass}>{formError}</p>}
        {info && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">{info}</p>
        )}
        {resetLink && (
          <div className="rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-3 text-left">
            <p className="text-xs font-medium text-stone-500">Reset link</p>
            <Link
              href={resetLink}
              className="mt-1 break-all text-sm font-medium text-[#8B7355] underline underline-offset-2 hover:text-[#6b5346]"
            >
              {resetLink}
            </Link>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className={authPrimaryButtonClass}>
          {isSubmitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className={authMutedFooterClass}>
        <Link className={authLinkClass} href="/login">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
