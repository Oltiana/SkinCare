import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardChrome } from "@/components/client/dashboard-chrome";
import { DashboardSearchProvider } from "@/components/client/dashboard-search-context";
import { getPublicAppName } from "@/lib/server/config";

function adminInitials(email: string, name?: string | null) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0]!.charAt(0) + parts[1]!.charAt(0)).toUpperCase();
    }
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  const local = email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "AD";
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  if (session.user.role !== "admin") {
    redirect("/?forbidden=1");
  }

  const email = session.user.email ?? "";
  const initials = adminInitials(email, session.user.name);

  return (
    <DashboardSearchProvider>
      <DashboardChrome appName={getPublicAppName()} userEmail={email} userInitials={initials}>
        {children}
      </DashboardChrome>
    </DashboardSearchProvider>
  );
}
