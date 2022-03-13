const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const packageJsonDeps = require("./package.json").dependencies;

module.exports = [
  {
    mode: "development",
    entry: "./src/main.js",
    target: "electron-main",
    output: {
      path: __dirname + "/dist",
      filename: "main.js",
    },
  },
  {
    mode: "development",
    entry: "./src/renderer.js",
    target: "electron-renderer",
    output: {
      path: __dirname + "/dist",
      filename: "renderer.js",
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: require.resolve("babel-loader"),
          options: {
            presets: [require.resolve("@babel/preset-react")],
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
        remotes: {
          "@descript/design-system":
            "design_system@http://localhost:3001/remote-design-system.js",
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
  },
];
