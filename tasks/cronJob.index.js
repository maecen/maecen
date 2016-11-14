// Load all environment variables from `.env` file
if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

require('babel-register')
require('babel-polyfill')

require('./cronJob')
