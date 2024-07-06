// const webpack = require("webpack");
// const path = require("path");
// const nodeExternals = require("webpack-node-externals");

import webpack from "webpack";
import path from "path";
import nodeExternals from "webpack-node-externals";

import NodemonPlugin from 'nodemon-webpack-plugin'; // Ding

module.exports = {
  entry: ["webpack/hot/poll?100", "./src/server.ts"],
  watch: true,
  target: "node",
  externals: [
    nodeExternals({
        allowlist: ["webpack/hot/poll?100"],

    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new NodemonPlugin(
      {
        script: './dist/server.js',
      }
    )
  ], // Ding
  output: {
    path: path.join(__dirname, "dist"),
    filename: "server.js"
  },
  
};
