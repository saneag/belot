import mongoose from "mongoose";

export default async function setupDb(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  if (!process.env.VITEST) {
    const [{ provisionAdmin }, { FeatureToggleService }] = await Promise.all([
      import("../services/auth-service.js"),
      import("../services/feature-toggle-service.js"),
    ]);
    await provisionAdmin();
    await FeatureToggleService.ensureCodeDefinedFeatureToggles();
  }
  console.log("Connected to MongoDB");
}
