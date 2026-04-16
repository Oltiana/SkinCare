import { redirect } from "next/navigation";

/** Same UI as /login — Register tab. */
export default function RegisterPage() {
  redirect("/login?register=1");
}
