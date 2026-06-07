import ReviewsClient from "./ReviewsClient";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

async function getReviews() {
  try {
    await connectDB();

    const reviews = await Review.find({})
      .populate("productId")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to load reviews for admin dashboard:", error);
    return [];
  }
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