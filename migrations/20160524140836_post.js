
exports.up = function (knex, Promise) {
  return knex.schema.createTable('posts', function (table) {
    table.uuid('id').primary()
    table.string('title', 100)
    table.uuid('maecenate').references('maecenates.id')
    table.uuid('author').references('users.id')
    table.string('author_alias', 50)
    table.text('content')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('posts')
}
