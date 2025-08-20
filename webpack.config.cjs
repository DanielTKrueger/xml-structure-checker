const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
  // Client bundle
  {
    name: "client",
    entry: "./src/app.ts",
    mode: "development",
    output: {
      path: path.resolve(__dirname, "dist/public"),
      filename: "bundle.js",
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
          test: /\.svg$/i,
          type: "asset/source"
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "src/index.html", to: "" }]
      })
    ],
    devtool: "source-map"
  },

  // Server bundle
  {
    name: "server",
    target: "node",
    entry: "./server/server.ts",
    mode: "development",
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, "dist-server"),
      filename: "server.cjs",
      libraryTarget: "commonjs2",
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    devtool: "source-map"
  }
];
