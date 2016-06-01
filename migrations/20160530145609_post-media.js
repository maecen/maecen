
exports.up = function (knex, Promise) {
  return knex.schema.createTable('post_media', function (table) {
    table.uuid('id').primary()
    table.uuid('post').references('post.id')
    table.string('url', 255)
    table.string('type', 20)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('post_media')
}
