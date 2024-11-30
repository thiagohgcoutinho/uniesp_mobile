/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * @format
 */

module.exports = {
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    },
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },
  };
  
  const { getDefaultConfig } = require("expo/metro-config");

  module.exports = (() => {
    const config = getDefaultConfig(__dirname);
  
    const { assetExts } = config.resolver;
    config.resolver.assetExts = assetExts.filter((ext) => ext !== "ttf");
    config.resolver.assetExts.push("ttf");
  
    return config;
  })();
  