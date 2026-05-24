import Link from "next/link";
import { AuthCardHeader } from "@/components/client/auth-card-header";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import type { AuthSearchParams } from "./types";

function tabHref(mode: "login" | "register", sp: AuthSearchParams): string {
  const params = new URLSearchParams();
  if (mode === "register") params.set("register", "1");
  if (sp.callbackUrl?.startsWith("/")) params.set("callbackUrl", sp.callbackUrl);
  const q = params.toString();
  return q ? `/login?${q}` : "/login";
}

type AuthUnifiedCardProps = {
  searchParams: AuthSearchParams;
};

export function AuthUnifiedCard({ searchParams }: AuthUnifiedCardProps) {
  const mode = searchParams.register === "1" ? "register" : "login";

  return (
    <div>
      <AuthCardHeader title={mode === "login" ? "Sign In" : "Create Account"} />

      <div className="mb-6 flex rounded-full bg-stone-100 p-1">
        <Link
          href={tabHref("login", searchParams)}
          scroll={false}
          className={
            mode === "login"
              ? "flex-1 rounded-full bg-white py-2.5 text-center text-sm font-semibold text-stone-900 shadow-sm transition"
              : "flex-1 rounded-full py-2.5 text-center text-sm font-medium text-stone-500 transition hover:text-stone-700"
          }
        >
          Sign In
        </Link>
        <Link
          href={tabHref("register", searchParams)}
          scroll={false}
          className={
            mode === "register"
              ? "flex-1 rounded-full bg-white py-2.5 text-center text-sm font-semibold text-stone-900 shadow-sm transition"
              : "flex-1 rounded-full py-2.5 text-center text-sm font-medium text-stone-500 transition hover:text-stone-700"
          }
        >
          Register
        </Link>
      </div>

      {mode === "login" ? (
        <LoginForm searchParams={searchParams} embedded />
      ) : (
        <RegisterForm embedded />
      )}
    </div>
  );
}
