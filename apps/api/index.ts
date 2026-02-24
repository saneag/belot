import dotenv from "dotenv";
import express from "express";

import gameRouter from "./routes/game-router.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/game", gameRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
