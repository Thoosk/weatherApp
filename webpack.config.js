const path = require("path");

module.exports = {
  mode: "development",

  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        // this rule will run babel over all our .js files, except for the ones in node_modules
        // babel ensures that older browsers can run our page too
        // still need to install babel with npm (npm i @babel/core @babel/preset-env babel-loader)
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          // without additional settings, this will reference .babelrc
          loader: "babel-loader",
        },
      },
      {
        // adding a loader for your css files
        // you first have to install it via npm (npm install --save-dev style-loader css-loader)
        // runs the style-loader and css-loader against all css files
        // you also need to import the css in your index.js in src
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      {
        // adding a processor for your images
        // will run through all the below mentioned files and process them through the asset manager
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  devtool: "source-map",

  devServer: {
    contentBase: "./dist",
  },
};
