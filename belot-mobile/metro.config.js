const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, '../shared')];

config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.extraNodeModules = {
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  '@react-native/virtualized-lists': path.resolve(
    __dirname,
    'node_modules/react-native/node_modules/@react-native/virtualized-lists'
  ),
  semver: path.resolve(__dirname, 'node_modules/semver'),
  zustand: path.resolve(__dirname, 'node_modules/zustand'),
};

module.exports = config;
