'use strict'
// Load all environment variables from `.env` file
if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

let path = require('path')

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '/migrations/'),
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true,
    debug: true
  },

  testing: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '/migrations/'),
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '/migrations/'),
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }

}
