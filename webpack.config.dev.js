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
        test: /\.scss$/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            // CSS Nano http://cssnano.co/options/
            minimize: !DEBUG,
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
    })
  ],
};
