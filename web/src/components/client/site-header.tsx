"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MyAccountModal } from "./my-account-modal";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

const navLink =
  "shrink-0 text-sm font-medium text-stone-700 transition hover:text-[#8f5f6a]";
const iconBtn =
  "rounded-xl p-2 text-stone-700 transition hover:bg-[#f0dfe4]/80 hover:text-[#7a4d5c]";

export function SiteHeader({ appName }: { appName: string }) {
  const { data: session, status } = useSession();
  const [accountOpen, setAccountOpen] = useState(false);

  const authed = status === "authenticated" && Boolean(session?.user?.email || session?.user?.id);
  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <header className="sticky top-0 z-50 isolate border-b border-[#e5e2dc] bg-[#f5f2ed]/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 font-[family-name:var(--font-luxury-serif)] text-lg font-medium italic tracking-wide text-[#8B7355] sm:text-2xl"
          >
            {appName}
          </Link>

          <nav
            className="hide-scrollbar z-0 flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto sm:gap-6 md:gap-8"
            aria-label="Primary"
          >
            <Link href="/" className={navLink}>
              Home
            </Link>
            <Link href="/products" className={navLink}>
              Products
            </Link>
            <Link href="/about" className={navLink}>
              About
            </Link>
          </nav>

          <div className="relative z-20 flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Link href="/cart" className={iconBtn} aria-label="Cart" prefetch>
              <ShoppingBagIcon className="h-6 w-6" />
            </Link>

            {status === "authenticated" && isAdmin && (
              <Link href="/dashboard" className={iconBtn} aria-label="Admin dashboard" prefetch>
                <CogIcon className="h-6 w-6" />
              </Link>
            )}

            {status === "loading" ? (
              <span className="px-2 text-sm text-stone-400">…</span>
            ) : authed && session ? (
              <button
                type="button"
                onClick={() => setAccountOpen(true)}
                className={iconBtn}
                aria-label="Account"
                aria-expanded={accountOpen}
                aria-haspopup="dialog"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            ) : (
              <Link href="/login" className={iconBtn} aria-label="Sign in" prefetch>
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {authed && session && (
        <MyAccountModal session={session} isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
      )}
    </>
  );
}
