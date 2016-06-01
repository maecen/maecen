
exports.up = function (knex, Promise) {
  return knex.schema.createTable('media', function (table) {
    table.uuid('id').primary()
    table.uuid('obj_id')
    table.uuid('obj_type')
    table.string('url', 255)
    table.string('type', 20)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  }).dropTable('post_media')
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('media')
    .createTable('post_media', function (table) {
      table.uuid('id').primary()
      table.uuid('post').references('post.id')
      table.string('url', 255)
      table.string('type', 20)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
}
