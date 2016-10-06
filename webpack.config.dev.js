var webpack = require('webpack');

const DEBUG = !process.argv.includes('--release')

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client',
    './client/index.js',
  ],

  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /.+\.config.js/, /\.s?css$/],
        loader: 'babel',
        query: {
          presets: ['react-hmre'],
        },
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true),
        PUBLIC_SUPPORTER_THRESHOLD: JSON.stringify(process.env.PUBLIC_SUPPORTER_THRESHOLD)
      }
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|da)/)
  ],
};
