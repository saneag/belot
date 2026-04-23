import { createBelotTsConfig } from "@belot/eslint-config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default createBelotTsConfig({ rootDir, language: "neutral" });
