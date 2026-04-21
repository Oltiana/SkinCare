"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { addReview } from "@/services/reviewServices";

export default function AddReview({ productId }: any) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submit = async () => {
    await addReview({
      productId,
      userName: "User",
      rating,
      comment,
    });

    setRating(0);
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