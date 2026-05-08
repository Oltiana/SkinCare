"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";

type Order = {
  _id: string;
  items: any[];
  total: number;
  status?: string;
  createdAt: string;
  user?: { name?: string; email?: string };
};

const STATUSES = [
  { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800" },
  { label: "Processing", bg: "bg-blue-100", text: "text-blue-700" },
  { label: "Completed", bg: "bg-green-100", text: "text-green-700" },
  { label: "Cancelled", bg: "bg-red-100", text: "text-red-700" },
];

function statusStyle(status?: string) {
  return STATUSES.find((s) => s.label === status) ?? STATUSES[0];
}

function StatusDropdown({
  orderId,
  current,
  onChange,
}: {
  orderId: string;
  current?: string;
  onChange: (id: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const style = statusStyle(current);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer ${style.bg} ${style.text}`}
      >
        {current || "Pending"}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 z-50 rounded-xl shadow-lg border border-gray-100 bg-white overflow-hidden w-36">
          {STATUSES.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                onChange(orderId, s.label);
                setOpen(false);
              }}
              className={`w-full text-left text-xs px-3 py-2 font-medium hover:opacity-80 transition ${s.bg} ${s.text}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/orders", { credentials: "include" });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server Error: ${res.status}`);
      }

      const data = await res.json();
      setOrders(data.orders || data);
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <span className="text-sm text-gray-400">Total: {orders.length}</span>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading orders...</p>}

        {error && (
          <p className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">
            {error}
          </p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-gray-400">No orders found</div>
        )}

        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-white/10 bg-[#f5f2ed]/70 p-5 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">
                    Order #
                    {(order as any).orderNumber
                      ? String((order as any).orderNumber).padStart(3, "0")
                      : order._id?.slice(-6) || "N/A"}
                  </h2>
                  <p className="text-xs text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusDropdown
                    orderId={order._id}
                    current={order.status}
                    onChange={updateStatus}
                  />

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="p-1.5 rounded-full hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="text-sm text-gray-800">
                {order.user?.name || order.user?.email || "Guest"}
              </div>

              {/* ITEMS */}
              <div className="space-y-1 text-sm">
                {order.items?.map((item: any, index: number) => (
                  <div
                    key={`${order._id}-${item.productId || index}`}
                    className="flex justify-between text-gray-950"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="pt-3 border-t border-white/10 text-right">
                <span className="font-semibold text-green-500">
                  Total: €{order.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACK TO STORE */}
      <div className="flex justify-center py-6">
        <Link href="/" className="text-sm text-[#5c4a45] hover:underline">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
