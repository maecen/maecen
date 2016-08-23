// Load all environment variables from `.env` file
if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

require('babel-register')
require('babel-polyfill')

module.exports = require('./server/server').default
