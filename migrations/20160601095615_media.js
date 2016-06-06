
exports.up = function (knex, Promise) {
  return knex.schema.createTable('media', function (table) {
    table.uuid('id').primary()
    table.uuid('obj_id')
    table.string('obj_type', 30)
    table.string('url', 255)
    table.string('type', 20)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  }).dropTable('post_media')
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('media')
    .createTable('post_media', function (table) {
      table.uuid('id').primary()
      table.uuid('post').references('posts.id')
      table.string('url', 255)
      table.string('type', 20)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
}
