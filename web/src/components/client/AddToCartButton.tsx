"use client";

import { useState } from "react";

export default function AddToCartButton({ product }: any) {
  const [added, setAdded] = useState(false);

  const addToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.price,
        }),
      });

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
