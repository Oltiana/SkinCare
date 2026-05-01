"use client";

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  items: any[];
  total: number;
  status?: string;
  createdAt: string;
  user?: { name?: string; email?: string };
};

export default function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOrders();
  }, []);

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

              <span
                className={`text-xs px-2 py-1 rounded ${
                  order.status === "Completed"
                    ? "bg-green-500/20 text-green-750"
                    : "bg-yellow-500/20 text-yellow-800"
                }`}
              >
                {order.status || "Pending"}
              </span>
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
