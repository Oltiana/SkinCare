import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: String,
    items: [OrderItemSchema],
    total: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
