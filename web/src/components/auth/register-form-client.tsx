"use client";

import { useActionState } from "react";
import {
  registerAction,
  type RegisterFormState,
} from "@/app/(client)/(auth)/register/actions";
import {
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/components/client/auth-ui";

export function RegisterFormClient() {
  const [state, formAction, isPending] = useActionState<RegisterFormState, FormData>(
    registerAction,
    null,
  );

  return (
    <form className="space-y-4" action={formAction} noValidate>
      <div>
        <label className={authLabelClass} htmlFor="reg-name">
          Full name
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Enter your full name"
          className={authFieldClass}
        />
      </div>
      <div>
        <label className={authLabelClass} htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email"
          className={authFieldClass}
        />
      </div>
      <div>
        <label className={authLabelClass} htmlFor="reg-password">
          Password
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Enter your password (8 or more characters, one capital letter, one symbol)"
          className={authFieldClass}
        />
      </div>
      <div>
        <label className={authLabelClass} htmlFor="reg-confirm">
          Confirm password
        </label>
        <input
          id="reg-confirm"
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
        {isPending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
