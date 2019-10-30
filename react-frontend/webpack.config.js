const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv')

module.exports = () => {

  const env = dotenv.config().parsed

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
  }, {})

  return {
    entry: [ '@babel/polyfill', './src/index.js' ],
    output: {
      path: path.resolve(`${__dirname}/../strapi-backend/public`),
      filename: 'bundle.js'
    },
    watchOptions: {
      poll: true,
      ignored: /node_modules/
    },
    mode: 'development',
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
      }),
      new webpack.DefinePlugin(envKeys)
    ]
  }
}
