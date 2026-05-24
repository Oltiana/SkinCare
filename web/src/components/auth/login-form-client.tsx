"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/app/(client)/(auth)/login/actions";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authLinkClass,
  authPrimaryButtonClass,
} from "@/components/client/auth-ui";

type LoginFormClientProps = {
  callbackUrl: string;
};

export function LoginFormClient({ callbackUrl }: LoginFormClientProps) {
  const [state, formAction, isPending] = useActionState<LoginFormState, FormData>(
    loginAction,
    null,
  );

  return (
    <form className="space-y-4" action={formAction} noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label className={authLabelClass} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email"
          className={authFieldClass}
        />
      </div>
      <div>
        <div className="flex items-center justify-between gap-2">
          <label className={authLabelClass} htmlFor="login-password">
            Password
          </label>
          <Link
            className={`${authLinkClass} !text-xs !font-medium normal-case`}
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          className={authFieldClass}
        />
      </div>

      {state?.error && <p className={authErrorClass}>{state.error}</p>}

      <button type="submit" disabled={isPending} className={authPrimaryButtonClass}>
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
