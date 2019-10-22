const path = require('path')
const htmlPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [ '@babel/polyfill', './src/index.js' ],
  output: {
    path: path.resolve(`${__dirname}/../backend/public`),
    filename: 'index.js'
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png)/,
        use: {
          loader: 'file-loader',
          query: {
            name: './img/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new htmlPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: false
    })
  ]
}
