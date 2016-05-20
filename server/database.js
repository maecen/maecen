import Knex from 'knex'
import Bookshelf from 'bookshelf'

const knexConfig = require('../knexfile')[process.env.NODE_ENV]
const knex = Knex(knexConfig)
const bookshelf = Bookshelf(knex)

export { knex }
export { bookshelf }
