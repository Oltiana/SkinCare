"use client";

import { useEffect, useState, useRef } from "react";
import { Trash2, ChevronDown } from "lucide-react";

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

  // ✅ Mbyll dropdown kur klikohet jashtë
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
      {/* BUTONI */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer ${style.bg} ${style.text}`}
      >
        {current || "Pending"}
        <ChevronDown size={12} />
      </button>

      {/* DROPDOWN */}
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || data);
    } catch (err) {
      console.error(err);
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
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <span className="text-sm text-gray-400">Total: {orders.length}</span>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-400 text-sm">Loading orders...</p>}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <div className="text-gray-400 text-sm">No orders found</div>
      )}

      {/* ORDERS LIST */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-white/10 bg-[#f5f2ed]/70 p-5 space-y-4"
          >
            {/* TOP */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Order #{order._id.slice(-6)}</h2>
                <p className="text-xs text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* ✅ CUSTOM DROPDOWN */}
                <StatusDropdown
                  orderId={order._id}
                  current={order.status}
                  onChange={updateStatus}
                />

                {/* DELETE */}
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
              {order.items?.map((item: any) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-gray-950"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>€{item.price * item.quantity}</span>
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
  );
}
