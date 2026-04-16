type HomeProps = {
  searchParams: Promise<{ forbidden?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const forbidden = sp.forbidden === "1";

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-1 flex-col items-center justify-center bg-[#faf9f7] px-4 py-16">
      {forbidden && (
        <div className="mb-8 w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
          You don&apos;t have access to that page (admin role required).
        </div>
      )}
      <div className="h-px w-14 bg-gradient-to-r from-transparent via-[#A68B88]/45 to-transparent" />
      <p className="mt-8 text-center text-sm text-stone-400">Home — this page is empty for now.</p>
    </div>
  );
}
