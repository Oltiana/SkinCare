"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);

  // FETCH CART
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data || { items: [] });
    } catch (err) {
      console.error(err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // INCREASE (SMOOTH)
  const increase = async (item: any) => {
    // update UI instantly
    setCart((prev: any) => ({
      ...prev,
      items: prev.items.map((i: any) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    }));

    // call API
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: item.productId,
        name: item.name,
        price: item.price,
      }),
    });
  };

  // DECREASE (SMOOTH)
  const decrease = async (item: any) => {
    setCart((prev: any) => ({
      ...prev,
      items: prev.items
        .map((i: any) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i: any) => i.quantity > 0),
    }));

    await fetch("/api/cart/decrease", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: item.productId }),
    });
  };

  // REMOVE (SMOOTH)
  const remove = async (id: string) => {
    setCart((prev: any) => ({
      ...prev,
      items: prev.items.filter((i: any) => i.productId !== id),
    }));

    await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: id }),
    });
  };

  // CHECKOUT
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      if (res.ok) {
        alert("Order placed successfully!");
        setCart({ items: [] }); // instant clear
      } else {
        const data = await res.json();
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const total =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    ) || 0;

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col bg-[#faf9f7] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-2xl">
        {/* TITLE */}
        <div className="text-center">
          <div className="h-px w-14 mx-auto bg-gradient-to-r from-transparent via-[#c9a8ad]/50 to-transparent" />
          <h1 className="mt-10 text-3xl font-semibold italic text-[#6b5346] sm:text-4xl">
            Cart
          </h1>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Loading cart...
          </p>
        )}

        {/* EMPTY */}
        {!loading && cart.items.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500">Your cart is empty.</p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full border border-[#e5e2dc] bg-[#f5f2ed]/90 px-8 py-3 text-sm font-semibold text-[#5c4a45]"
            >
              Back to home
            </Link>
          </div>
        )}

        {/* ITEMS */}
        <div className="mt-10 space-y-6">
          {cart.items.map((item: any) => (
            <div
              key={item.productId}
              className="grid grid-cols-[2fr_1fr_auto] items-center rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-5"
            >
              {/* INFO */}
              <div>
                <h2 className="font-semibold text-[#5c4a45]">{item.name}</h2>
                <p className="text-sm text-stone-500">{item.price}€</p>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decrease(item)}
                  className="px-3 py-1 rounded bg-[#e5e2dc]"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increase(item)}
                  className="px-3 py-1 rounded bg-[#e5e2dc]"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => remove(item.productId)}
                className="p-2 rounded-full hover:bg-red-100"
              >
                <Trash2 size={18} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        {!loading && cart.items.length > 0 && (
          <div className="mt-10 rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-6 text-center">
            <h2 className="text-lg font-semibold text-[#5c4a45]">
              Total: {total.toFixed(2)}€
            </h2>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full rounded-full bg-[#6b5346] py-3 text-white"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
