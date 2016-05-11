var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: __dirname + "/client/index.js",

  output: {
    path: __dirname + '/static/dist/',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [`css-loader?${JSON.stringify({
            sourceMap: false,
            modules: true,
            localIdentName: '[hash:base64:4]',
            minimize: true,
          })}`,
          'postcss-loader?parser=postcss-scss'].join('!')
        ),
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /.+\.config.js/, /\.s?css$/],
        loader: 'babel'
      }
    ],
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      }
    }),
    new ExtractTextPlugin("app.css")
  ],
};
