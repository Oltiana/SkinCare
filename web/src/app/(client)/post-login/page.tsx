import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** After login / OAuth — redirect by role (admin → /dashboard, user → home). */
export default async function PostLoginPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role === "admin") {
    redirect("/dashboard");
  }
  redirect("/");
}
