import { redirect } from "next/navigation";

/** Kept for old links — main admin UI is at /dashboard. */
export default function AdminPage() {
  redirect("/dashboard");
}
