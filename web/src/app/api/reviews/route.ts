import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const reviews = await Review.find({ productId });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const review = await Review.create(body);
  return NextResponse.json(review);
}