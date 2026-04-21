"use client";

export default function StarRating({ rating, setRating }: any) {
  return (
    <div>
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          onClick={() => setRating && setRating(star)}
          style={{
            fontSize: "20px",
            cursor: "pointer",
            color: rating >= star ? "gold" : "gray",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}