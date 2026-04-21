import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ❌ DELETE REVIEW
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  console.log("DELETE REVIEW:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await Review.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}