"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import type { OauthAvailability } from "@/types/oauth-availability";
import { AuthCardHeader } from "./auth-card-header";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

type Mode = "login" | "register";

function AuthUnifiedCardInner({ oauth }: { oauth: OauthAvailability }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(() =>
    searchParams.get("register") === "1" ? "register" : "login",
  );

  useEffect(() => {
    const tab = searchParams.get("register") === "1" ? "register" : "login";
    setMode(tab);
  }, [searchParams]);

  const syncUrl = useCallback(
    (next: Mode) => {
      setMode(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === "register") {
        params.set("register", "1");
      } else {
        params.delete("register");
      }
      const q = params.toString();
      router.replace(q ? `/login?${q}` : "/login", { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div>
      <AuthCardHeader title={mode === "login" ? "Sign In" : "Create Account"} />

      <div className="mb-6 flex rounded-full bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => syncUrl("login")}
          className={
            mode === "login"
              ? "flex-1 rounded-full bg-white py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition"
              : "flex-1 rounded-full py-2.5 text-sm font-medium text-stone-500 transition hover:text-stone-700"
          }
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => syncUrl("register")}
          className={
            mode === "register"
              ? "flex-1 rounded-full bg-white py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition"
              : "flex-1 rounded-full py-2.5 text-sm font-medium text-stone-500 transition hover:text-stone-700"
          }
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm oauth={oauth} embedded />
      ) : (
        <RegisterForm oauth={oauth} embedded />
      )}
    </div>
  );
}

export function AuthUnifiedCard({ oauth }: { oauth: OauthAvailability }) {
  return (
    <Suspense fallback={<p className="text-sm text-stone-500">Loading…</p>}>
      <AuthUnifiedCardInner oauth={oauth} />
    </Suspense>
  );
}
