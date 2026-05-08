import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { User } from "@/lib/server/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let orders: any[] = [];

    if (session.user.role === "admin") {
      orders = await Order.find()
        .sort({ orderNumber: -1, createdAt: -1 })
        .lean();
    } else {
      orders = await Order.find({ userId: session.user.id })
        .sort({ orderNumber: -1, createdAt: -1 })
        .lean();
    }

    // Populate user info në mënyrë të sigurt
    for (const order of orders) {
      try {
        if (order.userId) {
          const user = await User.findById(order.userId)
            .select("name email")
            .lean();

          order.user = user
            ? {
                name: user.name,
                email: user.email,
              }
            : null;
        }
      } catch (e) {
        order.user = null;
      }
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("❌ API Orders Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        orders: [],
      },
      { status: 500 },
    );
  }
}
