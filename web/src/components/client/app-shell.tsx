"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

export function AppShell({
  appName,
  children,
}: {
  appName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <>
      {!isDashboard && <SiteHeader appName={appName} />}
      <div
        className={
          isDashboard
            ? "flex min-h-svh min-h-0 flex-1 flex-col"
            : "flex min-h-0 flex-1 flex-col"
        }
      >
        {children}
      </div>
    </>
  );
}
