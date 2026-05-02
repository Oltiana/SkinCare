import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { User } from "@/lib/server/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  await connectDB();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders =
    session.user.role === "admin"
      ? await Order.find().sort({ createdAt: -1 })
      : await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

  const ordersWithUser = await Promise.all(
    orders.map(async (order: any) => {
      const user = await User.findById(order.userId).select("name email");
      return {
        ...order.toObject(),
        user: user ? { name: user.name, email: user.email } : null,
      };
    }),
  );

  return NextResponse.json(ordersWithUser);
}
