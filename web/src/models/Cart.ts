import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
});

const CartSchema = new mongoose.Schema({
  userId: String,
  items: [CartItemSchema],
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
