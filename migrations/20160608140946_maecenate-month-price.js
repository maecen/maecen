
exports.up = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.integer('monthly_minimum')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.dropColumn('monthly_minimum')
  })
}
