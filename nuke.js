const fs = require("node:fs");
const path = require("node:path");

const projectRoot = __dirname;
const dryRun = process.argv.includes("--dry-run");
const skipDirectories = new Set([".git", ".turbo", ".pnpm-store"]);

const isInsideProject = (targetPath) => {
  const relativePath = path.relative(projectRoot, targetPath);

  return relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
};

const findNodeModules = (directory) => {
  const nodeModulesDirectories = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (skipDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.name === "node_modules") {
      nodeModulesDirectories.push(entryPath);
      continue;
    }

    nodeModulesDirectories.push(...findNodeModules(entryPath));
  }

  return nodeModulesDirectories;
};

const nodeModulesDirectories = findNodeModules(projectRoot);

if (!nodeModulesDirectories.length) {
  console.log("No node_modules directories found.");
  process.exit(0);
}

for (const directory of nodeModulesDirectories) {
  const relativePath = path.relative(projectRoot, directory);

  if (!isInsideProject(directory)) {
    throw new Error(`Refusing to delete outside project root: ${directory}`);
  }

  if (dryRun) {
    console.log(`[dry-run] ${relativePath}`);
    continue;
  }

  fs.rmSync(directory, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100,
  });

  console.log(`Deleted ${relativePath}`);
}
