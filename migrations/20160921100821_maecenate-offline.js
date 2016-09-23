
exports.up = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.boolean('active').defaultTo(true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.dropColumn('active')
  })
}
