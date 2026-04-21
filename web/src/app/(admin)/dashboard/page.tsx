import Link from "next/link";
import { DashboardSalesChart } from "@/components/client/dashboard-sales-chart";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";

const cardSurface =
  "rounded-2xl border border-stone-200/60 bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.045)] sm:p-6";

function StatCard({
  title,
  value,
  sub,
  icon,
  href,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <div
      className={`flex h-full flex-col ${cardSurface} transition hover:border-stone-300/70 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-2.5 text-3xl font-semibold tabular-nums tracking-tight text-stone-900">{value}</p>
          {sub ? <p className="mt-1.5 text-xs font-semibold text-emerald-600">{sub}</p> : null}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fce8ee] text-[#8f4a5c]">
          {icon}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#b8956f] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

function BottleIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M9.75 3.104L19.8 15m0 0l-2.285 2.285M19.8 15l2.285 2.285M14.25 20.25v-4.5M5 14.5l2.285-2.285M5 14.5v4.5a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V14.5"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default async function DashboardHomePage() {
  let totalUsers = 0;
  try {
    await connectDb();
    totalUsers = await User.countDocuments();
  } catch (error) {
    console.error("Dashboard could not load user stats:", error);
  }

  return (
    <div className="min-h-full bg-white px-6 py-8 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-[1.65rem] font-semibold tracking-tight text-stone-900 sm:text-3xl">Dashboard</h1>


        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total products" value={0} icon={<BottleIcon />} />
          <StatCard title="Total orders" value={0} icon={<BagIcon />} />
          <StatCard title="Users" value={totalUsers} icon={<PersonIcon />} href="/dashboard/customers" />
          <StatCard title="Revenue" value="€0" icon={<CurrencyIcon />} />
        </div>

        <div className="mt-8">
          <DashboardSalesChart />
        </div>

        <section className={`mt-8 ${cardSurface}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-stone-900">Recent orders</h2>
            <span className="text-sm font-semibold text-[#9a7b56]">View all →</span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wide text-stone-400">
                  <th className="pb-3 pr-3 font-medium">ID</th>
                  <th className="pb-3 pr-3 font-medium">Customer</th>
                  <th className="pb-3 pr-3 font-medium">Total</th>
                  <th className="pb-3 pr-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Order date</th>
                </tr>
              </thead>
              <tbody className="text-stone-600">
                <tr>
                  <td colSpan={5} className="py-14 text-center text-sm text-stone-500">
                    No orders to show yet — table layout matches the reference dashboard design.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-stone-500 underline-offset-4 transition hover:text-stone-800 hover:underline"
          >
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
