import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env.local");
  }
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
}