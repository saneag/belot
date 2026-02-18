// eslint.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: [path.resolve(__dirname, "tsconfig.json")],
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);
