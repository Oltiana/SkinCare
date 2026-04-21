"use client";

import { useState } from "react";

export default function AddToCartButton({ product }: any) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const exists = cart.find((p: any) => p._id === product._id);

    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
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