"use client";

import { useMemo, useState } from "react";

type Period = "monthly" | "weekly" | "daily";

const DATA: Record<Period, number[]> = {
  monthly: [42, 55, 38, 62, 48, 71, 58, 64, 73, 68, 79, 74],
  weekly: [52, 45, 61, 48, 70, 55, 66],
  daily: [12, 18, 9, 22, 15, 28, 20, 24, 17, 19, 25, 21, 16, 23],
};

const LABELS: Record<Period, string> = {
  monthly: "Month",
  weekly: "Week",
  daily: "Day",
};

export function DashboardSalesChart() {
  const [period, setPeriod] = useState<Period>("monthly");
  const values = DATA[period];

  const { bars, linePoints } = useMemo(() => {
    const n = values.length;
    const vbW = 120;
    const floorY = 46;
    const maxH = 34;
    const maxV = Math.max(...values, 1);
    const slot = vbW / n;
    const barW = slot * 0.48;

    const barsInner = values.map((v, i) => {
      const h = (v / maxV) * maxH;
      const x = i * slot + (slot - barW) / 2;
      const y = floorY - h;
      return { x, y, w: barW, h };
    });

    const pts = barsInner.map((b) => `${(b.x + b.w / 2).toFixed(2)},${(b.y - 0.8).toFixed(2)}`).join(" ");

    return { bars: barsInner, linePoints: pts };
  }, [values]);

  return (
    <section className="rounded-2xl border border-stone-200/60 bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.045)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-stone-900">Sales this month</h2>
        <div
          className="flex w-fit rounded-full bg-stone-100/95 p-1 ring-1 ring-stone-200/40"
          role="tablist"
          aria-label="Periudha"
        >
          {(Object.keys(LABELS) as Period[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={period === key}
              onClick={() => setPeriod(key)}
              className={[
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm",
                period === key
                  ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/60"
                  : "text-stone-500 hover:text-stone-800",
              ].join(" ")}
            >
              {LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-stone-100 bg-gradient-to-b from-[#fdf8f9] to-[#f7f5f6] px-3 py-5 sm:px-5">
        <svg
          viewBox="0 0 120 52"
          className="h-44 w-full sm:h-52"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {bars.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={1.4} className="fill-[#f0b8c8]" />
          ))}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#722f37"
            strokeWidth="1.15"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="mt-3 text-center text-xs text-stone-400">Demo chart — same visual style as the reference design.</p>
    </section>
  );
}
