export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-1 items-center justify-center bg-[#F0EDE9] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[420px] rounded-[1.75rem] border border-stone-200/80 bg-white p-8 shadow-xl shadow-stone-900/10 sm:p-10">
        {children}
      </div>
    </div>
  );
}
