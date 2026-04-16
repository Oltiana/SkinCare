import { ResetPasswordForm } from "@/components/client/reset-password-form";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  return <ResetPasswordForm initialToken={token ?? ""} />;
}
