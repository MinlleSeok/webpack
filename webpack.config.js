const path = require("path");
// const CustomPlugin = require("./custom_plugin");
const webpack = require("webpack");
const banner = require("./banner.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./build")
  },
  module: {
    rules: [
      {
        // Object has test, custom-loader
        test: /\.js$/, // all files having .js suffix
        loader: [path.resolve("./custom_loader.js")] // set custom loader
      },
      {
        // Object has test, use
        test: /\.css$/, // .css suffix files
        use: [ process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // production
            : "style-loader", "css-loader" ] // uses "css-loader" and "style-loader"
      },
      // {
      //   test: /\.png$/, // .png files
      //   loader: "file-loader", // "file-loader"
      //   options: {
      //     // publicPath: "./",  //  prefix for output path
      //     name: "[name].[ext]?[hash]" // file name format
      //   }
      // },
      {
        test: /\.png$/, // .png files
        loader: "url-loader", // "url-loader"
        options: {
          // publicPath: "./",  //  prefix for output path
          name: "[name].[ext]?[hash]", // file name format
          limit: 5000 // under 5kb image file -> process to Data URL
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 9000,
    hot: true
  },
  plugins: [
    // new CustomPlugin(),
    new webpack.BannerPlugin(
      // {
      // banner: () => `Build Date Function: ${new Date().toLocaleString()}`
      // banner: `Build Date String: ${new Date().toLocaleString()}`
      // }
      banner
    ),
    new webpack.DefinePlugin({
      CONSTANT_VALUE: "1+1",
      VERSION: JSON.stringify(123),
      PRODUCTION: JSON.stringify(false),
      MAX_COUNT: JSON.stringify(999),
      "API.DOMAIN": JSON.stringify("http://google.com")
    }),
    new HtmlWebpackPlugin({
      hash: true, // adds webpack hash value into query string
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // removes white-space
              removeComments: true // removes comments
            }
          : false,
      template: "./src/index.html", // HTML template path
      templateParameters: {
        // injects Parameter
        env: process.env.NODE_ENV === "development" ? "(developing...)" : ""
      }
    }),
    new CleanWebpackPlugin(),
    process.env.NODE_ENV === "production"
      ? new MiniCssExtractPlugin({ filename: `[name].css` })
      : false
  ].filter(Boolean)
};
