const path = require('path')
const ChromeExtensionReloader = require('webpack-run-chrome-extension')
const copyPlugin = require("copy-webpack-plugin")

const paths = {
    build: path.resolve(__dirname, 'build'),
    src: path.resolve(__dirname, 'src')
}

module.exports = {
    entry: {
        background: path.join(__dirname, 'src', 'pages', 'background', 'index.js'),
        content: path.join(__dirname, 'src','pages', 'content', 'index.js')
    },
    mode: 'development',
    // target: "web",
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          }
        }
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
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', path.resolve(__dirname, 'core')],
        symlinks: false
    }
}
