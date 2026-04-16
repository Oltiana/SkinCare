import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Legacy /client path — kept for old links; redirects signed-in users to home. */
export default async function ClientDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/");
  }
  redirect("/");
}
