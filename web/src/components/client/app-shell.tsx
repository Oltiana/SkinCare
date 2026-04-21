"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import Footer from "./Footer";

export function AppShell({
  appName,
  children,
}: {
  appName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <>
      {!isDashboard && <SiteHeader appName={appName} />}

      <div
        className={
          isDashboard
            ? "flex min-h-svh min-h-0 flex-1 flex-col"
            : "flex min-h-screen flex-1 flex-col"
        }
      >
        {/* Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer (vetëm jashtë dashboard) */}
        {!isDashboard && <Footer />}
      </div>
    </>
  );
}