
exports.up = function (knex, Promise) {
  return knex.schema.createTable('access_tokens', (table) => {
    table.uuid('token').primary()
    table.uuid('user')
    table.timestamp('expires_at')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('access_tokens')
}
