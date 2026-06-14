import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

export function resolvePackageBin(packageName, binName, lookupDirs) {
  let pkgPath;

  for (const lookupDir of lookupDirs) {
    try {
      pkgPath = require.resolve(`${packageName}/package.json`, { paths: [lookupDir] });
      break;
    } catch {
      // try next lookup root
    }
  }

  if (!pkgPath) {
    throw new Error(`Could not resolve ${packageName}. Run \`pnpm install\` from the repo root.`);
  }

  const pkg = require(pkgPath);
  const binEntry = typeof pkg.bin === "string" ? pkg.bin : pkg.bin?.[binName];

  if (!binEntry) {
    throw new Error(`Could not find bin "${binName}" in ${packageName}.`);
  }

  return path.join(path.dirname(pkgPath), binEntry);
}
