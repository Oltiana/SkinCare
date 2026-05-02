import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST() {
  await connectDB();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Duhet të jesh i loguar për të bërë checkout" },
      { status: 401 },
    );
  }

  const userId = session.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const total = cart.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const order = await Order.create({ userId, items: cart.items, total });
  cart.items = [];
  await cart.save();

  return NextResponse.json({ message: "Order created successfully", order });
}
