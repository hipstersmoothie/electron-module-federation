const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies, version } = require("./package.json");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    publicPath: `http://localhost:3001/${version}/`,
    path: path.join(__dirname, "dist", version),
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
      name: "design_system",
      filename: "remoteEntry.js",
      library: { type: "var", name: "design_system" },
      exposes: {
        ".": "./src/index.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        "react-dom": {
          singleton: true,

          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
  ],
};
