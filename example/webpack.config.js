const HtmlWebPackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

module.exports = {
  entry: [resolve(__dirname, './index.js')],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: resolve(__dirname, './index.ejs'),
      filename: './index.html'
    })
  ]
}
