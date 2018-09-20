const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const extractSass = new ExtractTextPlugin({
  filename: "../css/style.css"
});

const webpackPlugin = new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery"
});

const browserSync = new BrowserSyncPlugin(
  {
    files: ["dist/**/*"],
    server: "dist"
  },
  { reload: false }
);

module.exports = {
  devtool: "eval-source-map",
  entry: {
    main: "./src/index"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/js")
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src/html"),
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].html",
              outputPath: "../"
            }
          },
          {
            loader: "extract-loader"
          },
          {
            loader: "html-loader",
            options: {
              minimize: false,
              conservativeCollapse: false,
              removeAttributeQuotes: false
            }
          },
          {
            loader: "nunjucks-html-loader",
            options: {
              searchPaths: [
                path.resolve(__dirname, "src/html"),
                path.resolve(__dirname, "src/html/modules"),
                path.resolve(__dirname, "src/html/templates"),
                path.resolve(__dirname, "src/html/util")
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src/js"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage"
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "src/scss"),
        exclude: /node_modules/,
        use: extractSass.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: false,
                importLoaders: 2
              }
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                parser: "postcss-scss",
                plugins: () => [require("autoprefixer")]
              }
            },
            {
              loader: "sass-loader",
              options: {
                minimize: false
              }
            }
          ]
        })
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        include: path.resolve(__dirname, "src/fonts"),
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "../fonts"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|webm)$/,
        include: path.resolve(__dirname, "src/img"),
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "../img"
          }
        }
      }
    ]
  },
  plugins: [
    extractSass,
    webpackPlugin,
    browserSync,
    new CleanWebpackPlugin(["dist"])
  ],
  watch: true
};
