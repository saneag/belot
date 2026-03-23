import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default async function setupDb(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}
