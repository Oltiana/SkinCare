"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);

  // FETCH CART
  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // INCREASE
  const increase = async (item: any) => {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(item),
    });
    fetchCart();
  };

  // DECREASE
  const decrease = async (item: any) => {
    await fetch("/api/cart/decrease", {
      method: "POST",
      body: JSON.stringify({ productId: item.productId }),
    });
    fetchCart();
  };

  // REMOVE
  const remove = async (id: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      body: JSON.stringify({ productId: id }),
    });
    fetchCart();
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
          <h1 className="mt-10 font-[family-name:var(--font-luxury-serif)] text-3xl font-semibold italic text-[#6b5346] sm:text-4xl">
            Cart
          </h1>
        </div>

        {/* EMPTY */}
        {cart?.items?.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-stone-500">Your cart is empty.</p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full border border-[#e5e2dc] bg-[#f5f2ed]/90 px-8 py-3 text-sm font-semibold text-[#5c4a45] transition hover:border-[#dccfd2] hover:bg-[#f0dfe4]/70"
            >
              Back to home
            </Link>
          </div>
        )}

        {/* ITEMS */}
        <div className="mt-10 space-y-6">
          {cart?.items?.map((item: any) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-5"
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

                <span className="text-sm">{item.quantity}</span>

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
                className="text-sm text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        {cart?.items?.length > 0 && (
          <div className="mt-10 rounded-2xl border border-[#e5e2dc] bg-[#f5f2ed]/70 p-6 text-center">
            <h2 className="text-lg font-semibold text-[#5c4a45]">
              Total: {total}€
            </h2>

            <button className="mt-4 w-full rounded-full bg-[#6b5346] py-3 text-white hover:bg-[#5c4a45] transition">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
