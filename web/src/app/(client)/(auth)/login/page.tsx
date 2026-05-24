import { AuthUnifiedCard } from "@/components/auth/auth-unified-card";
import type { AuthSearchParams } from "@/components/auth/types";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<AuthSearchParams>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return <AuthUnifiedCard searchParams={sp} />;
}
