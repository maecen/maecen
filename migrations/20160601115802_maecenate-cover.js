
exports.up = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.dropColumn('cover_url')
    table.uuid('cover_media').references('media.id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('maecenates', (table) => {
    table.dropColumn('cover_media')
    table.uuid('cover_url')
  })
}
