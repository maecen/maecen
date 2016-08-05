
exports.up = function (knex, Promise) {
  return knex.schema.createTable('transactions', function (table) {
    table.uuid('id').primary()
    table.uuid('maecenate').references('maecenates.id')
    table.uuid('user').references('users.id')
    table.integer('amount')
    table.string('currency', 3)
    table.string('status', 10)

    table.string('order_id', 9).unique()
    table.bigInteger('epay_id')
    table.string('type', 30)

    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('transactions')
}

