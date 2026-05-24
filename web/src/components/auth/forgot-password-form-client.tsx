"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  forgotPasswordAction,
  type ForgotPasswordFormState,
} from "@/app/(client)/(auth)/forgot-password/actions";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
} from "@/components/client/auth-ui";

export function ForgotPasswordFormClient() {
  const [state, formAction, isPending] = useActionState<
    ForgotPasswordFormState,
    FormData
  >(forgotPasswordAction, null);

  const resetHref = state?.email
    ? `/reset-password?email=${encodeURIComponent(state.email)}`
    : "/reset-password";

  return (
    <form className="space-y-4" action={formAction} noValidate>
      <div>
        <label className={authLabelClass} htmlFor="forgot-email">
          Email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email"
          className={authFieldClass}
        />
      </div>

      {state?.error && <p className={authErrorClass}>{state.error}</p>}
      {state?.emailError && (
        <p
          role="alert"
          className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950"
        >
          {state.emailError}
        </p>
      )}
      {state?.message && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
          {state.message}
        </p>
      )}
      {state?.devCode && (
        <div className="rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-3 text-center">
          <p className="text-xs font-medium text-stone-500">Dev code</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-[#8B7355]">
            {state.devCode}
          </p>
        </div>
      )}
      {(state?.email || state?.devCode) && (
        <Link
          href={resetHref}
          className={`${authPrimaryButtonClass} block text-center no-underline`}
        >
          Enter code &amp; new password
        </Link>
      )}

      <button type="submit" disabled={isPending} className={authPrimaryButtonClass}>
        {isPending ? "Sending…" : "Send code"}
      </button>
    </form>
  );
}
