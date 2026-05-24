import Link from "next/link";
import { AuthCardHeader } from "@/components/client/auth-card-header";
import { authLinkClass, authMutedFooterClass } from "@/components/client/auth-ui";
import { ForgotPasswordFormClient } from "./forgot-password-form-client";

export function ForgotPasswordForm() {
  return (
    <div>
      <AuthCardHeader title="Reset password" />

      <p className="mb-6 text-sm leading-relaxed text-stone-600">
        Enter the email you used to register. We&apos;ll send a 6-digit code to reset your
        password.
      </p>

      <ForgotPasswordFormClient />

      <p className={authMutedFooterClass}>
        <Link className={authLinkClass} href="/login">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
