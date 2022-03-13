const { ModuleFederationPlugin } = require("webpack").container;
const packageJsonDeps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    publicPath: "http://localhost:3001/",
    clean: true,
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
    new ModuleFederationPlugin({
      name: "design_system",
      filename: "remote-design-system.js",
      library: { type: "var", name: "design_system" },
      exposes: {
        ".": "./src/index.js",
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
