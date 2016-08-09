exports.up = function (knex, Promise) {
  return knex.schema.renameTable('supporters', 'subscriptions')
    .table('subscriptions', (table) => {
      table.string('currency', 3)
    }).createTable('sub_periods', (table) => {
      table.uuid('id').primary()
      table.uuid('subscription').references('subscriptions.id')
      table.uuid('transaction').references('transactions.id')
      table.date('start')
      table.date('end')
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.renameTable('subscriptions', 'supporters')
    .dropTable('sub_periods')
}
