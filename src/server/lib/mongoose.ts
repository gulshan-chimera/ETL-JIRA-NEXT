import mongoose from "mongoose";

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} & { conn?: any } = (globalThis as any)._mongoose || {
  conn: null,
  promise: null,
};

if (!cached) (globalThis as any)._mongoose = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error("Missing MONGO_URI");

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
