import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { email } = await searchParams;
  return <ResetPasswordForm defaultEmail={email ?? ""} />;
}
