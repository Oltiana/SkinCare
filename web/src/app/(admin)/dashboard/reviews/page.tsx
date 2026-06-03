import ReviewsClient from "./ReviewsClient";

async function getReviews() {
  const res = await fetch(
    "http://localhost:3000/api/reviews",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        ⭐ Reviews Dashboard
      </h1>

      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}