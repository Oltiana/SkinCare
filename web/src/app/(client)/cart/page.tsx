import Link from "next/link";

export default function CartPage() {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-1 flex-col bg-[#faf9f7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center">
        <div className="h-px w-14 bg-gradient-to-r from-transparent via-[#c9a8ad]/50 to-transparent" aria-hidden />
        <h1 className="mt-10 font-[family-name:var(--font-luxury-serif)] text-3xl font-semibold italic text-[#6b5346] sm:text-4xl">
          Cart
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-500">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full border border-[#e5e2dc] bg-[#f5f2ed]/90 px-8 py-3 text-sm font-semibold text-[#5c4a45] transition hover:border-[#dccfd2] hover:bg-[#f0dfe4]/70"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
