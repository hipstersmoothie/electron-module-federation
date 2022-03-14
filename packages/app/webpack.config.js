const path = require("path");
const endent = require("endent").default;
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies, version } = require("./package.json");
const designSystem = require("../design-system/package.json");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    publicPath: `http://localhost:3001/${version}/`,
    path: path.join(__dirname, "dist", version),
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: require.resolve("babel-loader"),
        options: {
          root: "../..",
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "descript_app",
      filename: "remoteEntry.js",
      library: { type: "var", name: "descript_app" },
      exposes: {
        ".": "./src/index.tsx",
      },
      shared: {
        "@descript/design-system": {
          requiredVersion: `^${designSystem.version}`,
        },
        react: { singleton: true, requiredVersion: dependencies.react },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
  ],
};
