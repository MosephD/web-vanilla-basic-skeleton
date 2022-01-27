const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    plugins: [
      new MiniCssExtractPlugin(),
      new CompressionPlugin({
        compressionOptions: {
          numiterations: 15,
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
      }),
    ],
    output: {
      filename: "[name].[contenthash].js",
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
});