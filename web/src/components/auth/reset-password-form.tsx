import Link from "next/link";
import { AuthCardHeader } from "@/components/client/auth-card-header";
import { authLinkClass, authMutedFooterClass } from "@/components/client/auth-ui";
import { ResetPasswordFormClient } from "./reset-password-form-client";

type ResetPasswordFormProps = {
  defaultEmail: string;
};

export function ResetPasswordForm({ defaultEmail }: ResetPasswordFormProps) {
  return (
    <div>
      <AuthCardHeader title="Reset password" />

      <p className="mb-6 text-sm leading-relaxed text-stone-600">
        Enter the 6-digit code from your email and choose a new password.
      </p>

      <ResetPasswordFormClient defaultEmail={defaultEmail} />

      <p className={`${authMutedFooterClass} !mt-6`}>
        <Link className={authLinkClass} href="/forgot-password">
          Send a new code
        </Link>
        {" · "}
        <Link className={authLinkClass} href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
