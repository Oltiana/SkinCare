import StarRating from "./StarRating";

export default function ReviewList({ reviews }: any) {
  return (
    <div>
      {reviews.map((r: any) => (
        <div key={r._id}>
          <h4>{r.userName}</h4>
          <StarRating rating={r.rating} />
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}