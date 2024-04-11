const path = require('path')
const ChromeExtensionReloader = require('webpack-run-chrome-extension')
const copyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
    build: path.resolve(__dirname, 'build'),
    src: path.resolve(__dirname, 'src')
}

// TODO: It should be refactored to make use of environment variables or so. [chrome-extension-boilerplate] for reference
const isDevelopment = true

const options = {
    entry: {
        content: path.join(__dirname, 'src', 'pages', 'content', 'index.ts'),
        background: path.join(__dirname, 'src', 'pages', 'background', 'index.ts'),
        popup: path.join(__dirname, 'popup.ts')
    },
    mode: 'development',
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
        new copyPlugin({
            patterns: [
                {
                    from: "src/manifest.json",
                    to: path.join(__dirname, 'build')
                }
            ]
        }),
        new ChromeExtensionReloader({
            // extensionPath: paths.src,
            extensionPath: path.join(__dirname, 'build'),
            autoReload: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            filename: "index.html",
            cache: false,
            scriptLoading: "blocking"
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx'],
        modules: ['node_modules', path.resolve(__dirname, 'core')],
        symlinks: false
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: '/'
    },
}

module.exports = options
