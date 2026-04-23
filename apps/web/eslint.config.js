import { createBelotTsConfig } from "@belot/eslint-config";
import reactRefresh from "eslint-plugin-react-refresh";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default createBelotTsConfig({
  rootDir: __dirname,
  project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
  language: "browser",
  react: true,
  extra: [
    reactRefresh.configs.vite,
    {
      files: ["**/*.{tsx,jsx}"],
      rules: {
        "react-refresh/only-export-components": [
          "error",
          {
            allowConstantExport: true,
            allowExportNames: ["useThemeContext", "buttonVariants"],
          },
        ],
      },
    },
  ],
});
