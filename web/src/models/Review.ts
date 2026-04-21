import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
});

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);