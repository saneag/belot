import dotenv from "dotenv";
import express, { type Application } from "express";

import { corsMiddleware } from "./config/cors-middleware.js";
import setupDb from "./config/setup-db.js";
import { HttpStatus } from "./constants/http-status.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import setupRoutes from "./routes/index.js";

dotenv.config();

const app: Application = express();

app.use(corsMiddleware);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(HttpStatus.OK).json({ status: "ok" });
});

setupRoutes(app);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  if (!process.env.PORT) {
    console.error("PORT is not defined in environment variables");
    process.exit(1);
  }

  await setupDb();

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}

if (!process.env.VITEST) {
  startServer().catch((error: unknown) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}

export { app, startServer };
