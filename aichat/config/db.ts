import mongoose from "mongoose";

declare global {
  var __mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.__mongoose || { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.log("Error Connecting to MongoDB", error);
    // clear promise so future attempts can retry
    cached.promise = null;
    throw error; // propagate to caller
  }
  return cached.conn;
}
