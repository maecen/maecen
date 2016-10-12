
exports.up = (knex, Promise) => {
  return knex.schema.table('posts', table => {
    table.string('status', 50).defaultTo('PUBLISHED')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('posts', table => {
    table.dropColumn('status')
  })
}
