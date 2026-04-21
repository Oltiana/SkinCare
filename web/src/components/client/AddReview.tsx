"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { addReview } from "@/services/reviewServices";

export default function AddReview({ productId }: any) {
  const [rating, setRating] = useState(1); // ✅ minimum 1
  const [comment, setComment] = useState("");

  const submit = async () => {
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

    setRating(1); // ✅ reset korrekt
    setComment("");
  };

  return (
    <div>
      <StarRating rating={rating} setRating={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submit}>Send Review</button>
    </div>
  );
}