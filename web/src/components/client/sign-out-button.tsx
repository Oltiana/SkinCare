"use client";

import { signOut } from "next-auth/react";
import { authPrimaryButtonClass } from "./auth-ui";

export function SignOutButton() {
  return (
    <button
      type="button"
      className={authPrimaryButtonClass}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </button>
  );
}
