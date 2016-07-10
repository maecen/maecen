import { knex } from '../database'
import { deleteFile } from '../util/fileUploader'

// Database Calls
// ==============
export function claimMedia (mediaIds, objType, objId, trx) {
  trx = trx || knex
  return trx('media')
    .where('id', 'in', mediaIds)
    .andWhere('obj_id', null)
    .update({ obj_id: objId, obj_type: objType })
}

export function deleteUnusedMedia (objType, objId, safeIds, trx) {
  trx = trx || knex
  return trx('media').whereNotIn('id', safeIds)
    .andWhere('obj_id', objId)
    .andWhere('obj_type', objType)
    .select('id')
    .then(media => media.map(o => o.id))
    .then(deleteMediaIds => {
      return deleteMedia(deleteMediaIds, trx)
    })
}

export function deleteMedia (ids, trx) {
  trx = trx || knex
  return trx('media').where('id', 'in', ids).then(media => {
    const deleteFiles = Promise.all(media.map(media => deleteFile(media.url)))
    return trx('media').where('id', 'in', ids).del().then(() => deleteFiles)
  })
}
