var webpack = require('webpack');

const DEBUG = !process.argv.includes('--release')


module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: ['webpack-hot-middleware/client',
          './client/index.js',
  ],

  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    publicPath: '/dist/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.(scss|css)$/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:3]',
          })}`,
          'postcss-loader?parser=postcss-scss',
        ],
      },
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
        CLIENT: JSON.stringify(true)
      }
      // TODO should we do window = global.window here?
    })
  ],
};
