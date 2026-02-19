const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.join(projectRoot, "node_modules"),
  path.join(workspaceRoot, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enableSymlinks = true;
config.resolver.extraNodeModules = {
  react: path.join(projectRoot, "node_modules", "react"),
  "react-native": path.join(projectRoot, "node_modules", "react-native"),
};

module.exports = withNativeWind(config, { input: "./styles/global.css" });
