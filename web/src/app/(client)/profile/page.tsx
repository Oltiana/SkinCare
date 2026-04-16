import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/client/sign-out-button";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const roleLabel = session.user.role === "admin" ? "Administrator" : "User";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Profile</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{session.user.email}</p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Role:{" "}
        <span
          className={
            session.user.role === "admin"
              ? "font-semibold text-amber-700 dark:text-amber-400"
              : "font-medium text-zinc-800 dark:text-zinc-200"
          }
        >
          {roleLabel}
        </span>
      </p>
      {session.user.role === "admin" ? (
        <p className="mt-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-amber-700 underline dark:text-amber-400"
          >
            Go to admin dashboard →
          </Link>
        </p>
      ) : null}
      <div className="mt-8 space-y-4">
        <SignOutButton />
        <p>
          <Link href="/" className="text-sm text-emerald-700 underline dark:text-emerald-400">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}
