const webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    //TODO: should fiddle with it later on
    //env = require("./utils/env"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    WriteFilePlugin = require("write-file-webpack-plugin")
    WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");


const paths = {
    src: path.resolve(__dirname, 'src'),
    build: path.resolve(__dirname, 'build')
}

// TODO: It should be refactored to make use of environment variables or so. [chrome-extension-boilerplate] for reference
const isDevelopment = true

const options = {
    mode: 'development',
    entry: {
        content: path.join(__dirname, 'src', 'pages', 'content', 'index.ts'),
        background: path.join(__dirname, 'src', 'pages', 'background', 'index.ts'),
        popup: path.join(__dirname, 'popup.ts')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    resolve: {
        //extensions: ['.ts', '.tsx'],
        extensions: ['ts', 'tsx', 'json', 'css', 'sass', 'scss', 'html', 'css'].map((extension) => "." + extension),
        modules: ['node_modules'],
        //symlinks: false
    },
    devServer: {
        devtool: 'inline-source-map',
        static: 'build',
    },
     //devServer: {
         //hot: true,
         //port: '8180',
         //contentBase: path.join(__dirname, 'build'),
        //static: {
          //directory: path.join(__dirname, 'src'),
          //publicPath: 'build',
            //watch: true,
        //},
      //},
    // target: "web",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: "ts-loader",
                  options: {
                      transpileOnly: true
                  }
              }
          ]
        },
      ]
    },
    watch: true,
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanStaleWebpackAssets: false
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src", to: path.join(__dirname, 'build') }
            ],
            options: {
                concurrency: 3
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            filename: "index.html",
            cache: false,
            scriptLoading: "blocking"
        }),
        new WriteFilePlugin(),
    ],
}

module.exports = options
