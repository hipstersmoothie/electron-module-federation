const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const packageJsonDeps = require("./package.json").dependencies;

module.exports = [
  {
    mode: "development",
    entry: "./src/main.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          loader: require.resolve("babel-loader"),
          options: {
            presets: [require.resolve("@babel/preset-typescript")],
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
    mode: "development",
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
            presets: [
              require.resolve("@babel/preset-react"),
              require.resolve("@babel/preset-typescript"),
            ],
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
