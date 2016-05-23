function modifyMaecenates(str, len) {
  return 'ALTER TABLE maecenates ALTER '+ str +' TYPE varchar('+ len +')
}

exports.up = function(knex, Promise) {
  const client = knex.client.config.client

  if (client === 'postgresql') {
    return knex.schema.raw(modifyMaecenates('logo_url', 255))
      .raw(modifyMaecenates('cover_url', 255))
      .raw(modifyMaecenates('title', 100))
      .raw(modifyMaecenates('slug', 100))
  } else if (client === 'sqlite3') {
    return knex.schema.dropTable('maecenates')
      .createTable('maecenates', function (table) {
        table.uuid('id').primary()
        table.string('title', 100).unique()
        table.string('slug', 100).unique()
        table.uuid('creator').references('users.id')
        table.string('logo_url', 255)
        table.string('cover_url', 255)
        table.string('teaser', 140)
        table.text('description')
        table.string('url', 255)
      })
  }
};

exports.down = function(knex, Promise) {
  //
};
