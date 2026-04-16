"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { useDashboardSearch } from "./dashboard-search-context";

function navLinkClass(active: boolean) {
  return [
    "flex w-full items-center gap-3 py-3 pl-5 pr-4 text-[0.9375rem] font-medium transition-colors",
    active
      ? "bg-[#f0dfe4] text-stone-900"
      : "text-stone-600 hover:bg-black/[0.03]",
  ].join(" ");
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.48-3.088M15 5.25a3 3 0 11-6 0 3 3 0 016 0zm6.872 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7.5 8.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}

function PowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
    </svg>
  );
}

type DashboardChromeProps = {
  appName: string;
  userEmail: string;
  userInitials: string;
  children: ReactNode;
};

export function DashboardChrome({ appName, userEmail, userInitials, children }: DashboardChromeProps) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useDashboardSearch();

  return (
    <div className="flex min-h-svh w-full flex-1 bg-white font-sans text-stone-900 antialiased">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#e5e2dc] bg-[#f5f2ed]">
        <div className="px-5 pt-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-luxury-serif)] text-[1.35rem] font-medium italic leading-snug tracking-wide text-stone-900"
          >
            {appName}
          </Link>
        </div>

        <nav className="mt-9 flex flex-1 flex-col gap-0" aria-label="Admin navigation">
          <Link href="/dashboard" className={navLinkClass(pathname === "/dashboard")}>
            <HomeIcon className="h-5 w-5 shrink-0 text-stone-500" />
            Dashboard
          </Link>
          <Link href="/dashboard/products" className={navLinkClass(pathname === "/dashboard/products")}>
            <BoxIcon className="h-5 w-5 shrink-0 text-stone-500" />
            Products
          </Link>
          <Link href="/dashboard/orders" className={navLinkClass(pathname === "/dashboard/orders")}>
            <DocIcon className="h-5 w-5 shrink-0 text-stone-500" />
            Orders
          </Link>
          <Link href="/dashboard/customers" className={navLinkClass(pathname === "/dashboard/customers")}>
            <PeopleIcon className="h-5 w-5 shrink-0 text-stone-500" />
            Customers
          </Link>
        </nav>

        <div className="px-5 pb-8 pt-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 py-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            <PowerIcon className="h-5 w-5 shrink-0 text-stone-500" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <header className="flex h-16 shrink-0 items-center justify-between gap-8 border-b border-stone-200/80 bg-white px-8 lg:px-12">
          <div className="relative w-72 max-w-[40%] shrink-0">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden>
              <svg className="h-[1.125rem] w-[1.125rem]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers"
              autoComplete="off"
              className="h-10 w-full rounded border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-200"
              aria-label="Search customers"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="relative p-2 text-stone-500 transition hover:text-stone-800"
              aria-label="Notifications"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute right-1 top-0.5 min-h-[1rem] min-w-[1rem] rounded-full bg-[#dc2626] px-1 text-center text-[10px] font-bold leading-none text-white">
                2
              </span>
            </button>

            <button
              type="button"
              className="ml-2 flex items-center gap-2 py-1 pl-1 pr-2 text-left"
              aria-label="Admin menu"
              title={userEmail}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c4a574] text-xs font-semibold text-white">
                {userInitials}
              </span>
              <span className="text-sm font-semibold text-stone-900">Admin</span>
              <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
