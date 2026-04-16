"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerFormSchema } from "@/lib/validations/auth";
import type { z } from "zod";
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

type RegisterValues = z.infer<typeof registerFormSchema>;

type RegisterFormProps = {
  oauth: OauthAvailability;
  embedded?: boolean;
};

export function RegisterForm({ oauth, embedded = false }: RegisterFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    });
    const data = (await res.json()) as { error?: string; ok?: boolean };
    if (!res.ok) {
      setFormError(data.error ?? "Registration failed.");
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <div>
      {!embedded && <AuthCardHeader title="Create Account" />}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className={authLabelClass} htmlFor="reg-name">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className={authFieldClass}
            {...register("name")}
          />
          {errors.name && <p className={authErrorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={authLabelClass} htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={authFieldClass}
            {...register("email")}
          />
          {errors.email && <p className={authErrorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={authLabelClass} htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password (8 or more characters, one capital letter, one symbol)"
            className={authFieldClass}
            {...register("password")}
          />
          {errors.password && <p className={authErrorClass}>{errors.password.message}</p>}
        </div>
        <div>
          <label className={authLabelClass} htmlFor="reg-confirm">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password again"
            className={authFieldClass}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className={authErrorClass}>{errors.confirmPassword.message}</p>
          )}
        </div>

        {formError && <p className={authErrorClass}>{formError}</p>}

        <button type="submit" disabled={isSubmitting} className={authPrimaryButtonClass}>
          {isSubmitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <OauthButtons oauth={oauth} callbackUrl="/post-login" />

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
