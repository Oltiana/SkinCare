import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST() {
  await connectDB();

  const userId = "1";

  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const total = cart.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  // 🟢 CREATE ORDER
  const order = await Order.create({
    userId,
    items: cart.items,
    total,
  });

  // 🧹 CLEAR CART
  cart.items = [];
  await cart.save();

  return NextResponse.json({
    message: "Order created successfully",
    order,
  });
}
