const path = require("path");

module.exports = {
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: [path.resolve(__dirname, "src/index.ts")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /__mocks__/,
      },
    ],
  },
};