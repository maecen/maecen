
exports.up = (knex, Promise) => {
  const client = knex.client.config.client

  if (client === 'postgresql') {
    return knex.schema.raw('ALTER TABLE media RENAME TO files')
    .raw('ALTER TABLE files ALTER type TYPE varchar(50)')
    .table('files', table => {
      table.string('role', 50)
      table.string('filename', 255)
    })
    .then(() => {
      return knex('files').update({ role: 'MEDIA' })
    })
  } else if (client === 'sqlite3') {
    return knex.schema.dropTable('media')
    .createTable('files', table => {
      table.uuid('id').primary()
      table.uuid('obj_id')
      table.string('obj_type', 30)
      table.string('url', 255)
      table.string('type', 50)
      table.string('role', 50)
      table.string('filename', 255)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .then(() => {
      knex.schema.table('maecenates', table => {
        table.dropForeign('cover_media')
        table.dropForeign('logo_media')
        table.foreign('cover_media').references('files.id')
        table.foreign('logo_media').references('files.id')
      })
    })
  }
}

exports.down = (knex, Promise) => {
  const client = knex.client.config.client

  if (client === 'postgresql') {
    return knex.schema.raw('ALTER TABLE files RENAME TO media')
    .table('media', table => {
      table.dropColumn('role')
      table.dropColumn('filename')
    })
  } else if (client === 'sqlite3') {
    return knex.schema.dropTable('files')
    .createTable('media', table => {
      table.uuid('id').primary()
      table.uuid('obj_id')
      table.string('obj_type', 30)
      table.string('url', 255)
      table.string('type', 20)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .then(() => {
      knex.schema.table('maecenates', table => {
        table.dropForeign('cover_media')
        table.dropForeign('logo_media')
        table.foreign('cover_media').references('media.id')
        table.foreign('logo_media').references('media.id')
      })
    })
  }
}
