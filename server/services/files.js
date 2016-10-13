// Imports
import uuid from 'node-uuid'
import Joi from 'joi'
import mapKeys from 'lodash/mapKeys'

// Utils
import * as cloudinaryHelper from '../util/cloudinaryHelper'
import * as googleStorageHelper from '../util/googleStorageHelper'
import { joiValidation } from '../util/ctrlHelpers'

// Constants
const fileRoles = {
  MEDIA: 'MEDIA',
  FILE: 'FILE'
}

// Schema validation of the data
// =============================
const schema = {
  id: Joi.string().guid(),
  obj_id: Joi.string().guid(),
  obj_type: Joi.string(),
  url: Joi.string().max(255),
  type: Joi.string().max(20),
  role: Joi.string().only(Object.keys(fileRoles)),
  filename: Joi.string().allow('', null)
}

// Database Calls
// ==============
export function claimFiles (knex, ids, objType, objId) {
  return knex('files')
    .where('id', 'in', ids)
    .andWhere('obj_id', null)
    .update({ obj_id: objId, obj_type: objType })
}

export function deleteUnusedFiles (knex, objType, objId, safeIds) {
  return knex('files').whereNotIn('id', safeIds)
    .andWhere('obj_id', objId)
    .andWhere('obj_type', objType)
    .select('id')
    .then(files => files.map(o => o.id))
    .then(deleteIds => {
      return deleteFiles(knex, deleteIds)
    })
}

export function deleteFiles (knex, ids) {
  return knex('files').where('id', 'in', ids).then(files => {
    const deleteRemoteFiles = Promise.all(files.map(file => {
      if (googleStorageHelper.belongsToService(file.url)) {
        return googleStorageHelper.deleteFile(file.url)
      } else if (cloudinaryHelper.belongsToService(file.url)) {
        return cloudinaryHelper.deleteFile(file.url)
      }
      throw new Error(`Could not recognize service on url: '${file.url}'`)
    }))

    return knex('files').where('id', 'in', ids).del()
    .then(() => deleteRemoteFiles)
  })
}

export function uploadMediaStream (knex, stream, attr) {
  let media = {
    ...attr,
    role: fileRoles.MEDIA,
    id: uuid.v1()
  }

  const path = `media/${media.id}`
  return joiValidation(media, schema)
  .then(() => {
    const type = attr.type.startsWith('video') ? 'video' : 'image'
    return cloudinaryHelper.uploadStream(stream, path, type)
  }).then((result) => {
    const data = {
      url: result.secure_url,
      ...media
    }
    return knex('files').insert(data)
    .then(() => data)
  })
}

export function uploadFileStream (knex, stream, attr) {
  let file = {
    ...attr,
    role: fileRoles.FILE,
    id: uuid.v1()
  }

  const path = `files/${file.id}/${file.filename}`
  return joiValidation(file, schema)
  .then(() => {
    const type = attr.type.startsWith('video') ? 'video' : 'image'
    return googleStorageHelper.uploadStream(stream, path, type)
  }).then((result) => {
    const data = {
      url: result.secure_url,
      ...file
    }
    return knex('files').insert(data)
    .then(() => data)
  })
}

export const populateMaecenatesWithMedia = (knex, maecenates) =>
  knex('files')
  .where('obj_type', 'maecenate')
  .where('role', fileRoles.MEDIA)
  .where('obj_id', 'in', maecenates.map(obj => obj.id))
  .select('id', 'url', 'type', 'created_at')
  .then(media => {
    const mappedMedia = mapKeys(media, (o) => o.id)
    return maecenates.map((maecenate) => ({
      ...maecenate,
      logo: mappedMedia[maecenate.logo_media],
      cover: mappedMedia[maecenate.cover_media]
    }))
  })

export const populatePostsWithFiles = (knex, posts) =>
  knex('files')
  .where('obj_type', 'post')
  .where('obj_id', 'in', posts.map(obj => obj.id))
  .select('id', 'url', 'obj_id', 'type', 'created_at', 'role', 'filename')
  .then(files =>
    posts.map(post => {
      const postFiles = files.filter(findObjId(post.id))
      const media = postFiles.filter(findMedia)
      const file = postFiles.find(findFile)
      return {
        ...post,
        media,
        file
      }
    })
  )

const findObjId = (id) => (file) => file.obj_id === id
const findMedia = (file) => file.role === fileRoles.MEDIA
const findFile = (file) => file.role === fileRoles.FILE
