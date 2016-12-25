let path = require('path');
let webpack = require('webpack');
let UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'build/index.js'),
  output: {
    path: 'dist',
    filename: 'premiere.min.js',
    library: 'premiere',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new UnminifiedWebpackPlugin()
  ]
};
