import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { productId } = await req.json();

  const cart = await Cart.findOne({ userId: "1" });

  const item = cart.items.find((i: any) => i.productId === productId);

  if (item) {
    item.quantity -= 1;
  }

  cart.items = cart.items.filter((i: any) => i.quantity > 0);

  await cart.save();

  return NextResponse.json(cart);
}
