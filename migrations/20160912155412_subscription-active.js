
exports.up = function (knex, Promise) {
  return knex.schema.table('subscriptions', (table) => {
    table.boolean('renew').defaultTo(true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('subscriptions', (table) => {
    table.dropColumn('renew')
  })
}
