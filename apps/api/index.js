import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import gameRouter from "./routes/game.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", () => {
  res.status(200).json({ message: "API is running" });
});
app.use("/game", gameRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
