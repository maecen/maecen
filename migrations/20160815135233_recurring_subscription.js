
exports.up = function (knex, Promise) {
  return knex.schema.table('subscriptions', (table) => {
    table.date('started_at')
  }).table('users', (table) => {
    table.bigInteger('epay_subscription_id')
    table.string('payment_card', 20)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('subscriptions', (table) => {
    table.dropColumn('started_at')
  }).table('users', (table) => {
    table.dropColumn('epay_subscription_id')
    table.dropColumn('payment_card')
  })
}
