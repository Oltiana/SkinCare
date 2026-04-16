import Link from "next/link";

export function AuthCardHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <h1 className="text-lg font-semibold tracking-tight text-stone-900">{title}</h1>
      <Link
        href="/"
        className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
        aria-label="Close and return home"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}
