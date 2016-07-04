import { knex } from '../database'
import { deleteFile } from '../util/fileUploader'

// Database Calls
// ==============
export function deleteMedia (ids, trx) {
  trx = trx || knex
  console.log('deleting this media', ids)
  return trx('media').where('id', 'in', ids).then(media => {
    const deleteFiles = Promise.all(media.map(media => deleteFile(media.url)))
    return trx('media').where('id', 'in', ids).del().then(() => deleteFiles)
  })
}
