
exports.up = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.string('payment_card_issuer', 3)
  }).table('transactions', (table) => {
    table.integer('fee')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('payment_card_issuer')
  }).table('transactions', (table) => {
    table.dropColumn('fee')
  })
}
