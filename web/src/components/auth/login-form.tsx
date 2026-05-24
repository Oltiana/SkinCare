import Link from "next/link";
import { AuthCardHeader } from "@/components/client/auth-card-header";
import { authLinkClass, authMutedFooterClass } from "@/components/client/auth-ui";
import type { AuthSearchParams } from "./types";
import { LoginFormClient } from "./login-form-client";

function authCallbackErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    AccessDenied: "Sign-in was cancelled or denied.",
    Configuration:
      "Server misconfiguration (AUTH_SECRET or MongoDB). Check the dev terminal.",
    Callback: "Callback error. Verify AUTH_URL and the port.",
  };
  return map[code] ?? `Sign-in failed (${code}). Try again.`;
}

type LoginFormProps = {
  searchParams: AuthSearchParams;
  embedded?: boolean;
};

export function LoginForm({ searchParams, embedded = false }: LoginFormProps) {
  const callbackUrl =
    searchParams.callbackUrl?.startsWith("/") ? searchParams.callbackUrl : "/post-login";
  const registered = searchParams.registered === "1";
  const resetOk = searchParams.reset === "1";
  const authError = authCallbackErrorMessage(searchParams.error);

  return (
    <div>
      {!embedded && <AuthCardHeader title="Sign In" />}

      {registered && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
          Account created. You can sign in now.
        </p>
      )}
      {resetOk && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
          Password reset. Sign in with your new credentials.
        </p>
      )}
      {authError && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900"
        >
          {authError}
        </p>
      )}

      <LoginFormClient callbackUrl={callbackUrl} />

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
