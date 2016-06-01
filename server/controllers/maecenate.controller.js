import { normalizeResponse } from '../util/ctrlHelpers'
import { uploadDataUri } from '../util/fileUploader'
import { knex } from '../database'
import Maecenate from '../models/Maecenate'

export function getMaecenate (req, res, next) {
  const { slug } = req.params
  let maecenate = null
  return Maecenate.where({ slug }).fetch().then((data) => {
    maecenate = data
  }).then(() => {
    return knex('media')
      .when('obj_id', maecenate.cover_media)
  }).then((media) => {
    return res.json(normalizeResponse({ maecenates: maecenate }))
  })
}

export function getMaecenates (req, res, next) {
  let maecenates = null
  return Maecenate.fetchAll().then((res) => {
    maecenates = res
    return knex('media')
      .when('obj_id', maecenates.map(obj => obj.cover_media))
  }).then((media) => {
    return res.json(normalizeResponse({ maecenates, media }))
  })
}

export function getUserMaecenates (req, res, next) {
  const { user } = req.params
  return Maecenate.where({ creator: user }).fetchAll().then((maecenates) => {
    return res.json(normalizeResponse({ maecenates }))
  })
}

export function createMaecenate (req, res, next) {
  const { userId } = req.user
  const { maecenate: data } = req.body
  const { logo_url: logoUrl, cover_media: coverMedia } = data

  let mediaIds = [coverMedia]
  let maecenate = new Maecenate(data)
  maecenate.generateId()
  maecenate.set('creator', userId)

  return maecenate.validate().then(() => {
    let imageUploads = []

    // Do the upload after the save! (so we validate first)
    if (logoUrl) {
      const path = `maecenate/${maecenate.id}-logo`
      imageUploads.push(uploadDataUri(logoUrl, path).then((result) => {
        maecenate.set('logo_url', result.secure_url)
      }))
    }

    return Promise.all(imageUploads)
  }).then(() => {
    return maecenate.save(null, { method: 'insert' }).then(() => {
      return knex('media')
        .where('id', 'in', mediaIds)
        .andWhere('obj_id', null)
        .update({
          obj_id: maecenate.get('id'),
          obj_type: 'maecenate'
        })
    })
  }).then(() => {
    return knex('media')
      .where('obj_id', maecenate.id)
      .andWhere('obj_type', 'maecenate')
  }).then((media) => {
    return res.json(normalizeResponse({
      maecenates: maecenate, media }, 'maecenates'))
  }).catch(next)
}
