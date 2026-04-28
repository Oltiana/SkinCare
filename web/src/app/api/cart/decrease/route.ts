import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { productId } = await req.json();

  let cart = await Cart.findOne({ userId: "1" });

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  const item = cart.items.find((i: any) => i.productId === productId);

  if (item) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i: any) => i.productId !== productId);
    }
  }

  await cart.save();

  return NextResponse.json(cart);
}
