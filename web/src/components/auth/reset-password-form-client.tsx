"use client";

import { useActionState } from "react";
import {
  resetPasswordAction,
  type ResetPasswordFormState,
} from "@/app/(client)/(auth)/reset-password/actions";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/components/client/auth-ui";

type ResetPasswordFormClientProps = {
  defaultEmail: string;
};

export function ResetPasswordFormClient({ defaultEmail }: ResetPasswordFormClientProps) {
  const [state, formAction, isPending] = useActionState<
    ResetPasswordFormState,
    FormData
  >(resetPasswordAction, null);

  return (
    <form className="space-y-4" action={formAction} noValidate>
      <div>
        <label className={authLabelClass} htmlFor="reset-email">
          Email
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
          placeholder="Enter your email"
          className={authFieldClass}
        />
      </div>
      <div>
        <label className={authLabelClass} htmlFor="reset-code">
          Code from email
        </label>
        <input
          id="reset-code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          pattern="\d{6}"
          placeholder="000000"
          className={`${authFieldClass} text-center font-mono text-lg tracking-[0.35em]`}
        />
      </div>
      <div>
        <label className={authLabelClass} htmlFor="reset-password">
          New password
        </label>
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="8+ characters, one capital letter, one symbol"
          className={authFieldClass}
        />
      </div>
      <div>
        <label className={authLabelClass} htmlFor="reset-confirm">
          Confirm password
        </label>
        <input
          id="reset-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Enter your password again"
          className={authFieldClass}
        />
      </div>

      {state?.error && <p className={authErrorClass}>{state.error}</p>}

      <button type="submit" disabled={isPending} className={authPrimaryButtonClass}>
        {isPending ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}
