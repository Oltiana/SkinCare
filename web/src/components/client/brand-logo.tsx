import Link from "next/link";

function monogramFromName(name: string): string {
  const m = name.match(/[A-Z]/g);
  if (m && m.length >= 2) return (m[0] + m[1]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "DW";
}

export function BrandLogo({ appName }: { appName: string }) {
  const initials = monogramFromName(appName);

  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5 rounded-lg outline-none ring-[#A68B88]/40 focus-visible:ring-2 sm:gap-3"
    >
      <span
        className="flex h-9 w-9 select-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#c9a87c] via-[#A68B88] to-[#7d6b58] text-[11px] font-bold tracking-tight text-white shadow-md shadow-[#A68B88]/20 ring-2 ring-white/70 transition duration-200 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-[#A68B88]/30 sm:h-10 sm:w-10 sm:text-sm"
        aria-hidden
      >
        {initials}
      </span>
      <span className="flex min-w-0 flex-col leading-[1.15]">
        <span className="font-[family-name:var(--font-luxury-serif)] text-[1.0625rem] font-semibold italic tracking-[0.02em] text-[#5c4d3f] sm:text-xl">
          DreamWith<span className="text-[#A68B88]">Lore</span>
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-400 sm:text-[10px]">
          studio
        </span>
      </span>
    </Link>
  );
}
