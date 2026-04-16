import mongoose, { Schema, model, models } from "mongoose";

const OrderLineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    priceCents: { type: Number, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [OrderLineSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
        message: "Order needs at least one line.",
      },
    },
    totalCents: { type: Number, min: 0 },
  },
  { timestamps: true },
);

export const Order = models.Order ?? model("Order", OrderSchema);
