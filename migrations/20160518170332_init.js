
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id', 36).primary()
    table.string('first_name', 50)
    table.string('last_name', 50)
    table.string('email', 50).unique()
    table.string('password', 60)
    table.string('alias', 50)
    table.string('phone_number', 20)
    table.string('country', 50)
    table.string('zip_code', 10)
  }).createTable('maecenates', function (table) {
    table.uuid('id').primary()
    table.string('title', 50).unique()
    table.string('slug', 50).unique()
    table.uuid('creator').references('users.id')
    table.string('logo_url', 100)
    table.string('cover_url', 100)
    table.string('teaser', 140)
    table.text('description')
    table.string('url', 100)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable('users')
    .dropTable('maecenates')
}
