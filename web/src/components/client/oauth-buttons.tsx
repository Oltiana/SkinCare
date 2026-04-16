"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import type { OauthAvailability } from "@/types/oauth-availability";

export function OauthButtons({
  callbackUrl,
  oauth,
}: {
  callbackUrl: string;
  oauth: OauthAvailability;
}) {
  const safeCallback = callbackUrl.startsWith("/") ? callbackUrl : "/post-login";
  const [loading, setLoading] = useState<null | "google" | "facebook">(null);
  const [err, setErr] = useState<string | null>(null);

  async function runOAuth(provider: "google" | "facebook") {
    if (provider === "google" && !oauth.google) return;
    if (provider === "facebook" && !oauth.facebook) return;

    setErr(null);
    setLoading(provider);
    try {
      // redirect: true — matches Auth.js docs; fewer CSRF / internal URL issues
      await signIn(provider, {
        callbackUrl: safeCallback,
        redirect: true,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error.";
      setErr(msg);
      setLoading(null);
    }
  }

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-stone-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 font-medium uppercase tracking-wide text-stone-400">
            or continue with
          </span>
        </div>
      </div>

      {err && (
        <p
          role="alert"
          className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-900"
        >
          {err}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={!oauth.google || loading !== null}
          title={oauth.google ? "Sign in with Google" : "Google sign-in is not enabled."}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => runOAuth("google")}
        >
          <GoogleIcon className="h-5 w-5 shrink-0" />
          <span>{loading === "google" ? "Opening Google…" : "Continue with Google"}</span>
        </button>

        <button
          type="button"
          disabled={!oauth.facebook || loading !== null}
          title={oauth.facebook ? "Sign in with Facebook" : "Facebook sign-in is not enabled."}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-[#0866FF] bg-[#1877F2] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => runOAuth("facebook")}
        >
          <FacebookIcon className="h-5 w-5 shrink-0 text-white" />
          <span>{loading === "facebook" ? "Opening Facebook…" : "Continue with Facebook"}</span>
        </button>
      </div>
    </>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}
