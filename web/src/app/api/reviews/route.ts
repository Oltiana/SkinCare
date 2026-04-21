import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ✅ GET REVIEWS
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  let reviews;

  if (productId && mongoose.Types.ObjectId.isValid(productId)) {
    reviews = await Review.find({ productId })
      .populate("productId")
      .sort({ createdAt: -1 });
  } else {
    reviews = await Review.find()
      .populate("productId")
      .sort({ createdAt: -1 });
  }

  return NextResponse.json(reviews);
}

// ✅ POST REVIEW
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const review = await Review.create(body);

    return NextResponse.json(review);
  } catch (error) {
    console.error("POST REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}