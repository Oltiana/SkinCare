import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema, "products");