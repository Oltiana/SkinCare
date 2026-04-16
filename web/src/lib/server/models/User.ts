import mongoose, { Schema, model, models } from "mongoose";
import type { UserRole } from "@/lib/server/auth/roles";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    /** Optional for OAuth. Stripped from JSON via `toJSON` (do not expose in API). */
    password: { type: String },
    name: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"] satisfies UserRole[],
      default: "user",
    },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true },
);

function stripPassword(_doc: unknown, ret: Record<string, unknown>) {
  delete ret.password;
  return ret;
}

UserSchema.set("toJSON", { transform: stripPassword });
UserSchema.set("toObject", { transform: stripPassword });

export const User = models.User ?? model("User", UserSchema);
