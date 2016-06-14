
exports.up = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.dropColumn('logo_url')
    table.uuid('logo_media').references('media.id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.dropColumn('logo_media')
    table.string('logo_url', 100)
  })
}
