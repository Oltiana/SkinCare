"use client";

import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 🗑 DELETE REVIEW (FIXED)
  const handleDelete = async (id: string) => {
    console.log("DELETE REVIEW:", id);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      console.log("STATUS:", res.status);

      const data = await res.json();
      console.log("RESPONSE:", data);

      // 🔥 update UI pa reload
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">⭐ Reviews Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r._id}
            className="bg-white p-4 rounded-2xl shadow"
          >
            {/* 🛍 PRODUCT */}
            <h2 className="font-bold text-lg">
              {r.productId?.name || "No product"}
            </h2>

            {/* 🖼 IMAGE */}
            {r.productId?.image && (
              <img
                src={`/${r.productId.image}`}
                className="h-32 w-full object-cover rounded my-2"
              />
            )}

            {/* 👤 USER */}
            <p className="text-sm text-gray-500">
              {r.userName}
            </p>

            {/* ⭐ RATING */}
            <p className="text-yellow-500">
              {"⭐".repeat(r.rating)}
            </p>

            {/* 💬 COMMENT */}
            <p className="mt-2">{r.comment}</p>

            {/* 🗑 DELETE BUTTON (FIXED) */}
            <button
              onClick={() => {
                if (!r._id) return;
                handleDelete(r._id);
              }}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}