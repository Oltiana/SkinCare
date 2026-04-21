"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { addReview } from "@/services/reviewServices";

export default function AddReview({ productId }: any) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      if (rating < 1) {
        alert("Zgjedh të paktën 1 yll");
        return;
      }

      await addReview({
        productId,
        userName: "User",
        rating,
        comment,
      });

      alert("Review u shtua ✅");

      setRating(1);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë shtimit ❌");
    }
  };

  return (
    <div>
      <StarRating rating={rating} setRating={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border w-full p-2 mt-2"
      />

      <button
        onClick={submit}
        className="mt-2 bg-black text-white px-4 py-1"
      >
        Send Review
      </button>
    </div>
  );
}