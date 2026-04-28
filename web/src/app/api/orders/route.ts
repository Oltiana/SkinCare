import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const orders = await Order.find({ userId: "1" }).sort({
    createdAt: -1,
  });

  return NextResponse.json(orders);
}
