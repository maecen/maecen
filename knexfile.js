'use strict'

let path = require('path')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, './development.sqlite'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '/migrations/'),
      tableName: 'knex_migrations'
    },
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
    },
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
