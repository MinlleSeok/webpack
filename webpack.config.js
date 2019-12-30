const path = require("path");
// const CustomPlugin = require("./custom_plugin");
const webpack = require("webpack");
const banner = require("./banner.js");

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
      { // Object has test, custom-loader
        test: /\.js$/, // all files having .js suffix
        loader: [path.resolve("./custom_loader.js")] // set custom loader
      },
      { // Object has test, use
        test: /\.css$/, // .css suffix files
        use: ["style-loader", "css-loader"] // uses "css-loader" and "style-loader"
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
    contentBase: path.join(__dirname, 'build'),
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
    )
  ]
};
