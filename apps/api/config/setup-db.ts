import dotenv from "dotenv";
import { Application } from "express";
import mongoose from "mongoose";

dotenv.config();

function setupDb(app: Application) {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error(err);
    });
}

export default setupDb;
