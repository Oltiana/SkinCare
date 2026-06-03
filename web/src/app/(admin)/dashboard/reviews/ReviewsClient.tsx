"use client";

import { useState } from "react";

export default function ReviewsClient({
  initialReviews,
}: {
  initialReviews: any[];
}) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="bg-white p-4 rounded-2xl shadow"
        >
          <h2 className="font-bold text-lg">
            {r.productId?.name || "No product"}
          </h2>

          {r.productId?.image && (
            <img
              src={`/${r.productId.image}`}
              className="h-32 w-full object-cover rounded my-2"
            />
          )}

          <p className="text-sm text-gray-500">
            {r.userName}
          </p>

          <p className="text-yellow-500">
            {"⭐".repeat(r.rating)}
          </p>

          <p className="mt-2">{r.comment}</p>

          <button
            onClick={() => handleDelete(r._id)}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}