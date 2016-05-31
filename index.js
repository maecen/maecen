// Load all environment variables from `.env` file
if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

require('babel-register');
require('babel-polyfill');
var hook = require('css-modules-require-hook');

// Ignore css files, as we don't want to compile them server side
hook({
  extensions: ['.scss'],
  preprocessCss: function (css, filepath) {
    return '';
  }
})


module.exports = require('./server/server').default;
