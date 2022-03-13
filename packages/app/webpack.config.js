const HtmlWebpackPlugin = require("html-webpack-plugin");
const endent = require("endent").default;
const { ModuleFederationPlugin } = require("webpack").container;
const packageJsonDeps = require("./package.json").dependencies;

const remotes = {
  "@descript/design-system":
    "design_system@http://localhost:3001/remoteEntry.js",
};

const dynamicRemotes = Object.entries(remotes).reduce(
  (acc, [alias, location]) => {
    const [globalName, url] = location.split("@");
    // acc[alias] = location;
    acc[alias] = endent`promise new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = "${url}";

      script.onload = () => {
        const proxy = {
          get: (request) => window.${globalName}.get(request),
          init: (arg) => {
            try {
              return window.${globalName}.init(arg)
            } catch(e) {
              console.log('remote container already initialized')
            }
          }
        }
        resolve(proxy)
      }

      document.head.appendChild(script);
    })`;

    return acc;
  },
  {}
);

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
        remotes: dynamicRemotes,
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
