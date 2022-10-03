module.exports = {
  mode: "production",
  entry: {
    main: "./index.ts",
  },
  output: {
    path: __dirname,
    filename: "./dist/bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: "ts-loader",
      },
    ],
  },
};
