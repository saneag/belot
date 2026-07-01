import dotenv from "dotenv";
import express, { type Application } from "express";

import setupDb from "./config/setup-db";
import setupRoutes from "./routes";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

async function startServer() {
  if (!process.env.PORT) {
    console.error("PORT is not defined in environment variables");
    process.exit(1);
  }

  await setupDb();
  setupRoutes(app);

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}

if (!process.env.VITEST) {
  void startServer();
}

export { app, startServer };
