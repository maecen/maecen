
exports.up = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.string('language')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('language')
  })
}
