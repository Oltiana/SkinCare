import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const total = cart.items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
      0,
    );

    // Gjenerimi i orderNumber
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const orderNumber =
      lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber + 1 : 1;

    const order = await Order.create({
      orderNumber,
      userId,
      items: cart.items,
      total,
      status: "Pending",
    });

    // Pastro cart
    cart.items = [];
    await cart.save();

    console.log(`✅ Order created: #${orderNumber}`); // për debug

    return NextResponse.json({
      message: "Order created successfully",
      order,
    });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      {
        message: "Diçka shkoi keq",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
