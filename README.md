
# Understands Frontend Development Environment: Webpack

***Reference***

<http://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html>
<https://webpack.js.org/>

***INDEX***

- [Understands Frontend Development Environment: Webpack](#understands-frontend-development-environment-webpack)
  - [1. Background](#1-background)
    - [1.1 Before Module (Global Area Function)](#11-before-module-global-area-function)
    - [1.2 IIFE(Immediately Invoked Function Expression) Module](#12-iifeimmediately-invoked-function-expression-module)
    - [1.3 Various Module Spec](#13-various-module-spec)
    - [1.4 Supports Modules in Browser Environment](#14-supports-modules-in-browser-environment)
  - [2. Entry / Output](#2-entry--output)
  - [3. webpack-dev-server](#3-webpack-dev-server)
  - [4. Loader](#4-loader)
    - [4.1 Loader Role](#41-loader-role)
    - [4.2 Custom Loader](#42-custom-loader)
  - [5. Useful Loader](#5-useful-loader)
    - [5.1 css-loader](#51-css-loader)
    - [5.2 style-loader](#52-style-loader)
    - [5.3 file-loader](#53-file-loader)
    - [5.4 url-loader](#54-url-loader)
  - [6. Plugin](#6-plugin)
    - [6.1 Plugin Role](#61-plugin-role)
  - [7. Useful Plugin](#7-useful-plugin)
    - [7.1 BannerPlugin](#71-bannerplugin)
    - [7.2 DefinePlugin](#72-defineplugin)
    - [7.3 Html Template Plugin](#73-html-template-plugin)
    - [7.4 Clean Webpack Plugin](#74-clean-webpack-plugin)
    - [7.5 Mini Css Extract Plugin](#75-mini-css-extract-plugin)
  - [8. Node Express](#8-node-express)

## 1. Background

### 1.1 Before Module (Global Area Function)

:: normal_function.js

```js
function sum(a, b) { return a + b; }
```

### 1.2 IIFE(Immediately Invoked Function Expression) Module

:: iife_function.js

```js
var math = math || {};  // math namespace

(function() {
    function sum(a, b) { return a + b; }
    math.sum = sum; // add namespace
})();
```

### 1.3 Various Module Spec

- CommonJS - makes Modules in every environment using Javascript
- export keyword - make a module
- require() function - import a module

:: math.js

```js
export function sum(a, b) { return a + b; }
```

:: app.js

```js
const sum = require('./math.js');

console.log(sum(1, 2));
```

:: sum.js

```js
export function sum(a, b) { return a + b; }
```

:: app.js

```js
import * as math from './sum.js';

console.log(math.sum(1, 2));
```

### 1.4 Supports Modules in Browser Environment

:: index.html

```html
<script type="module" src="app.js"></script>
```

## 2. Entry / Output

- Webpack is a bundler to make one file.
- finds every dependent module from entry point.
- (app.js => math.js) -> one_bundle.js

```bash
$ npm install webpack webpack-cli
installing...
```

```bash
$ node_modules/.bin/webpack --help
webpack-cli 3.3.10

Usage: webpack-cli [options]
       webpack-cli [options] --entry <entry> --output <output>
       webpack-cli [options] <entries...> --output <output>
       webpack-cli <command> [options]
       ...
```

```bash
% node_modules/.bin/webpack --mode development --entry ./src/app.js --output build/main.js
```

- **--mode** : webpack mode option
- **--entry** : webpack entry point option
- **--output** : webpack output path option

:: build/index.html

```html
<script type="module" src="main.js"></script>
```

--config

```bash
$ node_modules/.bin/webpack --help
Config options:
  --config               Path to the config file
                            [문자열] [기본: webpack.config.js or webpackfile.js]
```

:: webpack.config.js

```js
const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        main: "./src/app.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve("./build")
    }
}
```

- **mode** : "development"
- **entry** : application entry point "./src/app.js"
- **output** : "[name].js" => way to make string from entry.main
- **output.path** : node.js core module "path" -> resolve("absolute path")

:: package.json

```json
{
    "scripts": {
        "build": "./node_modules/.bin/webpack"
    }
}
```

***working well***

```bash
% npm run build
```

## 3. webpack-dev-server

```bash
% npm i webpack-dev-server -D
```

:: webpack.config.js

```js
module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 9000,
        hot: true
    }
}
```

:: package.json

```json
{
    "scripts": {
        "start": "webpack-dev-server"
    }
}
```

***working well***

```bash
% npm run start
```

## 4. Loader

### 4.1 Loader Role

- Loader checks all files like a module.

### 4.2 Custom Loader

:: custom_loader.js

```js
module.exports = function customLoader (content) {
    console.log("Custom Loader is working");
    return content;
}
```

- returns file content

:: webpack.config.js

```js
module.exports = {
module: {
        rules: [{ // Object has test, use
            test: /\.js$/,  // regular expression : all files having .js suffix
            loader: [path.resolve("./custom_loader.js")] // set custom loader
        }]
    }
}
```

## 5. Useful Loader

### 5.1 css-loader

```bash
% npm i css-loader
```

:: app.js

```js
import "./style.css"
```

:: style.css

```css
background-color: green;
```

:: webpack.config.js

```js
{ // Object has test, use
    test: /\.css$/, // .css suffix files
    use: ["css-loader"] // uses "css-loader"
}
```

### 5.2 style-loader

```bash
% npm i style-loader
```

- Style Sheet Module needs to be added to the DOM.

:: webpack.config.js

```js
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    }
}
```

### 5.3 file-loader

```bash
% npm i file-loader
```

- Example) Image File to Module

:: style.css

```css
body {
    background-iamge: url("bg.png");
}
```

:: webpack.config.js

```js
module.exports = {
    module: {
        rules: [{
            test: /\.png$/, // .png files
            loader: "file-loader", // "file-loader",
            options: {
                // depends on contentBase configuration
                // devServer: {
                //  contentBase: path.join(__dirname, 'build')
                // }
                // publicPath: "./build/",  //  prefix for output path
                name: "[name].[ext]?[hash]" // file name format
            }
        }]
    }
}
```

### 5.4 url-loader

```bash
% npm i url-loader
```

- It is necessary to change image processing loader rule  

:: webpack.config.js

```js
module.exports = {
    module: {
        rules: [{
            test: /\.png$/, // .png files
            loader: "url-loader", // "url-loader"
            options: {
            // publicPath: "./",  //  prefix for output path
            name: "[name].[ext]?[hash]", // file name format
            limit: 5000 // under 5kb image file -> process to Data URL
            // fallback: "file-loader" // Default value
            }
        }]
    }
}
```

- under 5KB image file -> data:image
- upper 5KB image file -> build/[image].[ext]

## 6. Plugin

### 6.1 Plugin Role

- process buldled result

:: custom_plugin.js

```js

class Custom_Plugin {
    apply(compiler) {
        compiler.hooks.done.tap("Custom Plugin", stats => {
            console.log("Custom Plugin: done");
        })

        compiler.plugin("emit", (compilation, callback) => {    // compiler.plugin() function
            const source = compilation.assets["main.js"].source();
            compilation.assets["main.js"].source = () => {
                const banner = [
                    "/**",
                    " * Banner Plugin Result",
                    " * Build Date: " + new Date(),
                    " */"
                ].join("\n");
                return banner + "\n\n" + source;
            }
            // console.log(source);
            callback();
        })
    }
}

module.exports = Custom_Plugin;
```

:: webpack.config.js

```js
const CustomPlugin = require("./custom_plugin");

module.exports = {
    plugins: [
        new CustomPlugin()
    ]
}
```

## 7. Useful Plugin

### 7.1 BannerPlugin

:: banner.js

```js
const childProcess = require("child_process");

module.exports = function banner() {
    const commit = childProcess.execSync("git rev-parse --short HEAD");
    const user = childProcess.execSync("git config user.name");
    const date = new Date().toLocaleString();

    return (
        `Commit Version: ${commit}` +
        `Build Date: ${date}\n` +
        `Author: ${user}`
    );
}
```

:: webpack.config.js

```js
const webpack = require("webpack");
const banner = require("./banner.js");

module.exports = {
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
}
```

### 7.2 DefinePlugin

- separates Development and Operation Environments

:: webpack.config.js

```js
const webpack = require("webpack");
process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            CONSTANT_VALUE: "1+1",
            VERSION: JSON.stringify("v.1.0.1"),
            PRODUCTION: JSON.stringify(false),
            MAX_COUNT: JSON.stringify(999),
            "API.DOMAIN": JSON.stringify("http://google.com")
    })
    ]
}
```

:: app.js

```js
console.log(process.env.NODE_ENV);
console.log(CONSTANT_VALUE);
console.log(VERSION);
console.log(PRODUCTION);
console.log(MAX_COUNT);
console.log(API.DOMAIN);
```

### 7.3 Html Template Plugin

- handles html template file

```bash
% npm i html-webpack-plugin
```

:: build/index.html => src/index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <title>title <%= env %></title>
    </head>
    <body>
        <!-- remove loading script -->
        <!-- <script type="module" src="./main.js"></script> -->
    </body>
</html>
```

:: webpack.config.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            hash: true, // adds webpack hash value into query string
            minify: process.env.NODE_ENV === "production" ? {
                collapseWhitespace: true, // removes white-space
                removeComments: true  // removes comments
            } : false,
            template: "./src/index.html", // HTML template path
            templateParameters: { // injects Parameter
                env: process.env.NODE_ENV === "development" ? "(developing...)" : ""
            }  
        })
    ]
}
```

:: package.json

```json
{
    "scripts": {
        "pro": "NODE_ENV=production npm run build"
    }
}
```

### 7.4 Clean Webpack Plugin

- After building, cleans up unused files.

```bash
% npm i clean-webpack-plugin
```

:: webpack.config.js

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

### 7.5 Mini Css Extract Plugin

- makes css file

```bash
% npm i mini-css-extract-plugin
```

:: webpack.config.js

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    module: {
        rules: [
            ...,
            {
                // Object has test, use
                test: /\.css$/, // .css suffix files
                use: [ process.env.NODE_ENV === "production"
                ? MiniCssExtractPlugin.loader // production
                : "style-loader", "css-loader" ] // uses "css-loader" and "style-loader"
            }
        ]
    },
    ...,
    plugins: [
        ...,
        process.env.NODE_ENV === "production"
        ? new MiniCssExtractPlugin({ filename: `[name].css` })
        : false
    ].filter(Boolean)
};
```

## 8. Node Express

```bash
% npm i express
```

:: server.js

```js
const express = require("express");
const app = express()
const port = 3000

app.use("/", express.static(__dirname + '/build'));

app.listen(port, () => console.log(`listening on port ${port}`));
```

:: package.json

```js
{
    "scripts": {
        "build": "./node_modules/.bin/webpack",
        "build:pro": "NODE_ENV=production npm run build",
        "serve": "node server.js",
        "dev": "npm run build && webpack-dev-server",
        "pro": "npm run build:pro && npm run serve"
    }
}
```

***Happy Working***

```bash
% npm run pro
```

---

$$ Bundle your Assets! $$
