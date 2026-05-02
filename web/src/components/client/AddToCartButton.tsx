"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const GUEST_CART_KEY = "guest_cart";

export default function AddToCartButton({ product }: any) {
  const [added, setAdded] = useState(false);
  const { status } = useSession();

  const addToCart = async () => {
    try {
      if (status === "authenticated") {
        // ✅ I loguar — ruaj në databazë
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            name: product.name,
            price: product.price,
          }),
        });
      } else {
        // ✅ Guest — ruaj në localStorage
        const existing = JSON.parse(
          localStorage.getItem(GUEST_CART_KEY) || "[]",
        );
        const exist = existing.find((i: any) => i.productId === product._id);
        if (exist) {
          exist.quantity += 1;
        } else {
          existing.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
          });
        }
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(existing));
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <button
      onClick={addToCart}
      style={{
        background: added ? "green" : "black",
        color: "white",
        padding: "8px",
        transition: "0.3s",
        transform: added ? "scale(1.1)" : "scale(1)",
      }}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
