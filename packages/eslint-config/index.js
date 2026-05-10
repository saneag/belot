import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const defaultIgnores = [
  "dist",
  "node_modules",
  "coverage",
  ".turbo",
  "android",
  "ios",
  "build",
  ".expo",
];

/**
 * @typedef {"node" | "browser" | "neutral"} BelotEslintLanguage
 */

/**
 * @param {object} options
 * @param {string} options.rootDir - Absolute path to the package root (`import.meta.dirname` or `path.dirname(fileURLToPath(import.meta.url))`).
 * @param {string | string[]} [options.project="./tsconfig.json"]
 * @param {BelotEslintLanguage} [options.language="neutral"]
 * @param {boolean} [options.react=false]
 * @param {import("eslint").Linter.Config[]} [options.extra=[]] - Additional flat configs (e.g. `eslint-plugin-react-refresh`), merged after ignores.
 */
export function createBelotTsConfig(options) {
  const {
    rootDir,
    project = ["./tsconfig.json"],
    language = "neutral",
    react = false,
    extra = [],
  } = options;

  const languageGlobals =
    language === "node"
      ? globals.node
      : language === "browser"
        ? globals.browser
        : { ...globals.es2021, ...globals.builtin };

  return defineConfig([
    globalIgnores(defaultIgnores),
    ...extra,
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: Array.isArray(project) ? project : [project],
          tsconfigRootDir: rootDir,
          ecmaVersion: 2020,
          sourceType: "module",
        },
        globals: languageGlobals,
      },
      plugins: {
        "@typescript-eslint": tseslint.plugin,
        ...(react ? { "react-hooks": reactHooks } : {}),
      },
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        ...(react ? [reactHooks.configs.flat.recommended] : []),
      ],
    },
  ]);
}
