#!/usr/bin/env node

/**
 * Wrapper script for gluestack-ui CLI to work with pnpm monorepos
 *
 * Usage: node scripts/gluestack-add.js <component-name>
 * Example: node scripts/gluestack-add.js button
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const componentName = process.argv[2];

if (!componentName) {
  console.error("❌ Error: Please provide a component name");
  console.error("Usage: node scripts/gluestack-add.js <component-name>");
  console.error("Example: node scripts/gluestack-add.js button");
  process.exit(1);
}

console.log(`🚀 Adding gluestack-ui component: ${componentName}`);

// Temporarily rename workspace packages to avoid the "workspace:" protocol error
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const originalDeps = { ...packageJson.dependencies };

// Replace workspace:* with version numbers temporarily
let modified = false;
if (packageJson.dependencies) {
  Object.keys(packageJson.dependencies).forEach((dep) => {
    if (packageJson.dependencies[dep] === "workspace:*") {
      packageJson.dependencies[dep] = "*";
      modified = true;
    }
  });
}

if (modified) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("📝 Temporarily modified package.json for gluestack CLI compatibility");
}

let cliSucceeded = false;

try {
  // Run the gluestack-ui CLI
  console.log("⏳ Running gluestack-ui CLI...");
  execSync(`pnpm dlx gluestack-ui add ${componentName}`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });

  // Check if component was actually created
  const targetPath = path.join(__dirname, "..", "components", "ui", componentName);
  if (fs.existsSync(targetPath)) {
    cliSucceeded = true;
    console.log("✅ Component added successfully via CLI!");
  } else {
    throw new Error("Component files were not created by CLI");
  }
} catch (error) {
  console.log("⚠️  CLI encountered errors (expected with pnpm workspaces)");
  console.log("📦 Attempting to copy component files from cache...");

  // Try to copy component from gluestack cache
  const gluestackCachePath = path.join(os.homedir(), ".gluestack", "cache", "gluestack-ui");
  const possibleSourcePaths = [
    path.join(gluestackCachePath, "apps", "starter-kit-expo", "components", "ui", componentName),
    path.join(gluestackCachePath, "src", "components", "ui", componentName),
    path.join(gluestackCachePath, "apps", "starter-kit-next", "components", "ui", componentName),
  ];

  let componentCopied = false;
  const targetPath = path.join(__dirname, "..", "components", "ui", componentName);

  for (const sourcePath of possibleSourcePaths) {
    if (fs.existsSync(sourcePath)) {
      try {
        // Create target directory if it doesn't exist
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }

        // Copy component files
        const files = fs.readdirSync(sourcePath);
        for (const file of files) {
          const sourceFile = path.join(sourcePath, file);
          const targetFile = path.join(targetPath, file);
          fs.copyFileSync(sourceFile, targetFile);
        }

        console.log(`✅ Component files copied from cache: ${sourcePath}`);
        componentCopied = true;
        break;
      } catch (copyError) {
        console.error(`❌ Failed to copy from ${sourcePath}:`, copyError.message);
      }
    }
  }

  if (!componentCopied) {
    console.error("❌ Could not find component in gluestack cache");
    console.error(
      "💡 Try running the gluestack CLI manually: pnpm dlx gluestack-ui add " + componentName,
    );
  } else {
    // Install dependencies with pnpm
    console.log("📦 Installing dependencies with pnpm...");
    try {
      execSync("pnpm install --no-frozen-lockfile", {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      });
      console.log("✅ Dependencies installed successfully!");
    } catch (installError) {
      console.error("⚠️  Some dependencies may need manual installation");
    }
  }
} finally {
  // Restore original package.json
  if (modified) {
    packageJson.dependencies = originalDeps;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("🔄 Restored package.json to original state");
  }
}

// Format the component with prettier
const componentPath = path.join(__dirname, "..", "components", "ui", componentName);
if (fs.existsSync(componentPath)) {
  console.log("🎨 Formatting component with prettier...");
  try {
    execSync(`pnpm prettier --write "components/ui/${componentName}/**/*.{ts,tsx}"`, {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
    console.log("✅ Component formatted!");
  } catch (formatError) {
    console.log("⚠️  Could not format component (continuing anyway)");
  }
}

console.log("\n✨ Done! Your component is ready to use.");
console.log(`Import it from: @/components/ui/${componentName}`);
