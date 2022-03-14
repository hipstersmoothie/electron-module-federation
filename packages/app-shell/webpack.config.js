const HtmlWebpackPlugin = require("html-webpack-plugin");
const endent = require("endent").default;
const { ModuleFederationPlugin } = require("webpack").container;
const packageJsonDeps = require("./package.json").dependencies;
const makeDynamicRemotes = require("../../make-dynamic-remotes");

const remotes = {
  "@descript/app": "descript_app@http://localhost:3001",
};

module.exports = [
  {
    mode: "production",
    entry: "./src/main.ts",
    target: "electron-main",
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
    output: {
      path: __dirname + "/dist",
      filename: "main.js",
    },
  },
  {
    mode: "production",
    entry: "./src/renderer.ts",
    target: "electron-renderer",
    output: {
      path: __dirname + "/dist",
      filename: "renderer.js",
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
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new ModuleFederationPlugin({
        name: "renderer",
        remotes: makeDynamicRemotes(remotes),
        shared: {
          react: { singleton: true, requiredVersion: packageJsonDeps.react },
          "react-dom": {
            singleton: true,
            requiredVersion: packageJsonDeps["react-dom"],
          },
        },
      }),
    ],
  },
];
