const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ],
  },
];
