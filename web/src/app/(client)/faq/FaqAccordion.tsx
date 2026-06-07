"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Item = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#e5e2dc] overflow-hidden rounded-2xl border border-[#e5e2dc] bg-white shadow-sm">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-[#faf9f7]"
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-gray-800">{item.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-stone-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="border-t border-[#e5e2dc] bg-[#faf9f7]/60 px-6 py-4 text-sm leading-relaxed text-stone-500">
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}