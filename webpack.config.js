const path = require("path");
const webpack = require("webpack");
const { dirs } = require("./src/config");
const dotenv = require("dotenv-webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = (env) => {
  return {
    entry: {
      "app": [
        path.join(dirs.src.assets, "scripts", "index.js")
      ]
    },

    output: {
      path: dirs.public,
      filename: "scripts/[name].js",
      publicPath: "/"
    },

    module: {
      rules: [
        {
          test:/\.(s*)css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: "postcss-loader?parser=postcss-scss",
                options: {
                  plugins: [
                    require("autoprefixer")(),
                    require("postcss-clean")()
                  ]
                }
              },
              "sass-loader"
            ]
          })
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          query: {
            presets: ["es2015"]
          }
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&mimetype=application/font-woff",
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: `file-loader?name=${dirs.public}/fonts/[name].[ext]`
        },
        {
          test: /\.(ico|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: `file-loader?name=${dirs.public}/images/[name].[ext]`
        }
      ]
    },

    /*
     * Resolve module folders. This allows us to import files into
     * other files (in the client directory) without messy relative paths.
     */

    resolve: {
      modules: [
        "node_modules"
      ]
    },

    plugins: [
      new dotenv(),
      new ExtractTextPlugin({
        filename: "styles/[name].css"
      }),
      new CopyWebpackPlugin([
        {
          from: `${dirs.src.assets}/images/**/*`,
          to: `${dirs.public}/images`,
          flatten: true
        },
        {
          from: `${dirs.src.assets}/fonts/**/*`,
          to: `${dirs.public}/fonts`,
          flatten: true
        }
      ]),
      new UglifyWebpackPlugin(),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i
      })
    ],

    devtool: "source-map",

    stats: {
      colors: true
    }
  };
};
