import dotenv from "dotenv";
import express from "express";

import setupDb from "./config/setup-db";
import setupRoutes from "./routes";

dotenv.config();

const app = express();

app.use(express.json());

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

void startServer();
