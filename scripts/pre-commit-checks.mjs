#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function toPosix(file) {
  return file.replace(/\\/g, "/");
}

function getStagedFiles() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMR -z", {
    encoding: "buffer",
  });

  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map(toPosix);
}

function syncLockfile(stagedFiles) {
  const hasPackageJsonChange = stagedFiles.some((file) =>
    /(^|\/)package\.json$/.test(file),
  );

  if (!hasPackageJsonChange) {
    return;
  }

  console.log("package.json changed — syncing pnpm-lock.yaml...");
  execSync("pnpm install --lockfile-only", { cwd: root, stdio: "inherit" });
  execSync("git add pnpm-lock.yaml", { cwd: root, stdio: "inherit" });
  console.log("pnpm-lock.yaml updated and staged.");
}

function findWorkspacePackage(file) {
  let dir = path.posix.dirname(file);

  while (dir && dir !== ".") {
    const packageJsonPath = path.join(root, dir, "package.json");

    if (
      (dir.startsWith("apps/") || dir.startsWith("packages/")) &&
      existsSync(packageJsonPath)
    ) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      return { dir, name: packageJson.name, scripts: packageJson.scripts ?? {} };
    }

    const parent = path.posix.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return null;
}

function shouldCheckPackage(file, pkg) {
  if (file === path.posix.join(pkg.dir, "package.json")) {
    return true;
  }

  if (/\.(ts|tsx|mjs|js|jsx)$/.test(file)) {
    return true;
  }

  return /(?:eslint\.config|tsconfig)/.test(path.posix.basename(file));
}

function shouldFormatCheck(file) {
  return /\.(ts|tsx|md|js|mjs|cjs|jsx|json|ya?ml|css)$/.test(file);
}

function runFormatCheck(stagedFiles) {
  const filesToCheck = stagedFiles.filter(shouldFormatCheck);

  if (filesToCheck.length === 0) {
    return;
  }

  console.log(`Running format check for ${filesToCheck.length} staged file(s)...`);
  execSync(`pnpm prettier --check ${filesToCheck.map((file) => JSON.stringify(file)).join(" ")}`, {
    cwd: root,
    stdio: "inherit",
  });
}

function runLintAndTypecheck(stagedFiles) {
  const packages = new Map();

  for (const file of stagedFiles) {
    const pkg = findWorkspacePackage(file);
    if (!pkg || !shouldCheckPackage(file, pkg)) {
      continue;
    }

    packages.set(pkg.name, pkg);
  }

  if (packages.size === 0) {
    return;
  }

  const filters = [...packages.keys()].map((name) => `--filter=${name}`).join(" ");

  console.log(`Running lint and typecheck for: ${[...packages.keys()].join(", ")}`);
  execSync(`pnpm turbo run lint typecheck ${filters}`, {
    cwd: root,
    stdio: "inherit",
  });
}

const stagedFiles = getStagedFiles();
syncLockfile(stagedFiles);
runFormatCheck(stagedFiles);
runLintAndTypecheck(stagedFiles);
