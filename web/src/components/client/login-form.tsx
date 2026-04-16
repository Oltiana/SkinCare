"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/app/(client)/(auth)/login/actions";
import type { OauthAvailability } from "@/types/oauth-availability";
import { AuthCardHeader } from "./auth-card-header";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authLinkClass,
  authMutedFooterClass,
  authPrimaryButtonClass,
} from "./auth-ui";
import { OauthButtons } from "./oauth-buttons";

function oauthCallbackErrorMessage(code: string | null): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    OAuthSignin: "OAuth sign-in failed. Check your credentials in .env.local and restart the server.",
    OAuthCallback:
      "Return from Google/Facebook failed. Verify the redirect URI in the developer console.",
    OAuthAccountNotLinked:
      "This OAuth account isn’t linked to an existing user. Try another email or sign up with a password.",
    AccessDenied: "Sign-in was cancelled or denied.",
    Configuration:
      "Server misconfiguration (AUTH_SECRET, MongoDB, or OAuth keys). Check the dev terminal.",
    Callback: "Callback error. Verify AUTH_URL and the port.",
  };
  return map[code] ?? `OAuth sign-in failed (${code}). Try again or use email and password.`;
}

type LoginFormProps = {
  oauth: OauthAvailability;
  /** Inside unified card with Register — no duplicate header/footer */
  embedded?: boolean;
};

export function LoginForm({ oauth, embedded = false }: LoginFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/post-login";
  const registered = searchParams.get("registered");
  const resetOk = searchParams.get("reset");
  const oauthError = oauthCallbackErrorMessage(searchParams.get("error"));

  const [state, formAction, isPending] = useActionState<LoginFormState, FormData>(
    loginAction,
    null,
  );

  return (
    <div>
      {!embedded && <AuthCardHeader title="Sign In" />}

      {registered === "1" && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
          Account created. You can sign in now.
        </p>
      )}
      {resetOk === "1" && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
          Password reset. Sign in with your new credentials.
        </p>
      )}
      {oauthError && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900"
        >
          {oauthError}
        </p>
      )}

      <form className="space-y-4" action={formAction} noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl.startsWith("/") ? callbackUrl : "/"} />

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
            <Link className={`${authLinkClass} !text-xs !font-medium normal-case`} href="/forgot-password">
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

      <OauthButtons oauth={oauth} callbackUrl={callbackUrl.startsWith("/") ? callbackUrl : "/"} />

      {!embedded && (
        <p className={authMutedFooterClass}>
          Don&apos;t have an account?{" "}
          <Link className={authLinkClass} href="/register">
            Create account
          </Link>
        </p>
      )}
    </div>
  );
}
