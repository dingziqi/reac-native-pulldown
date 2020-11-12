/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy(
      {
        "react-native-pulldown": path.resolve(__dirname, "../src"),
      },
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : path.join(process.cwd(), `node_modules/${name}`),
      }
    ),
  },
  watchFolders: [path.resolve(__dirname, "../src")],
};
