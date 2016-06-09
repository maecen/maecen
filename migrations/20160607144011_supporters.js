
exports.up = function (knex, Promise) {
  return knex.schema.createTable('supporters', function (table) {
    table.uuid('id').primary()
    table.uuid('maecenate').references('maecenates.id')
    table.uuid('user').references('users.id')
    table.integer('amount')
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.unique(['maecenate', 'user'])
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('supporters')
}

