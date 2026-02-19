const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const fastDevEnabled = process.env.EXPO_FAST_DEV === "1";

const config = getDefaultConfig(projectRoot);

config.watchFolders = fastDevEnabled
  ? [path.join(workspaceRoot, "packages"), path.join(workspaceRoot, "shared")]
  : [workspaceRoot, path.join(workspaceRoot, ".pnpm")];
config.resolver.nodeModulesPaths = [
  path.join(projectRoot, "node_modules"),
  path.join(workspaceRoot, "node_modules"),
];
if (fastDevEnabled) {
  config.resolver.disableHierarchicalLookup = true;
}
config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, { input: "./styles/global.css" });
