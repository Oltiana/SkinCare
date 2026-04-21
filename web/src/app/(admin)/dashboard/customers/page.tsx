import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CustomersTable, type CustomerRow } from "@/components/client/customers-table";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { isDevDashboardOpen } from "@/lib/dev-dashboard";

export default async function DashboardCustomersPage() {
  const session = await auth();
  const devOpen = isDevDashboardOpen();

  if (!devOpen) {
    if (!session?.user?.id) {
      redirect("/login?callbackUrl=/dashboard/customers");
    }
    if (session.user.role !== "admin") {
      redirect("/?forbidden=1");
    }
  }

  let docs: Array<{
    _id: unknown;
    email: string;
    name?: string;
    role?: string;
    createdAt?: Date | string;
  }> = [];
  try {
    await connectDb();
    docs = await User.find()
      .sort({ createdAt: -1 })
      .select({ email: 1, name: 1, role: 1, createdAt: 1 })
      .lean();
  } catch (error) {
    console.error("Dashboard customers could not load users:", error);
  }

  const users: CustomerRow[] = docs.map((d) => ({
    id: String(d._id),
    email: d.email,
    name: (d.name as string) || "",
    role: d.role as string,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
  }));

  return <CustomersTable users={users} currentUserId={session?.user?.id ?? ""} />;
}
