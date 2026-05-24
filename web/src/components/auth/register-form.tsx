import Link from "next/link";
import { AuthCardHeader } from "@/components/client/auth-card-header";
import { authLinkClass, authMutedFooterClass } from "@/components/client/auth-ui";
import { RegisterFormClient } from "./register-form-client";

type RegisterFormProps = {
  embedded?: boolean;
};

export function RegisterForm({ embedded = false }: RegisterFormProps) {
  return (
    <div>
      {!embedded && <AuthCardHeader title="Create Account" />}

      <RegisterFormClient />

      {!embedded && (
        <p className={authMutedFooterClass}>
          Already have an account?{" "}
          <Link className={authLinkClass} href="/login">
            Sign In
          </Link>
        </p>
      )}
    </div>
  );
}
