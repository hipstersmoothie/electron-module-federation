const endent = require("endent").default;
const { ModuleFederationPlugin } = require("webpack").container;
const packageJsonDeps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: __dirname + "/dist",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
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
        react: { singleton: true, requiredVersion: packageJsonDeps.react },
        "react-dom": {
          singleton: true,
          requiredVersion: packageJsonDeps["react-dom"],
        },
      },
    }),
  ],
};
