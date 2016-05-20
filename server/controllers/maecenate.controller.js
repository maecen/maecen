import { normalizeResponse } from '../util/ctrlHelpers'
import { uploadDataUri } from '../util/fileUploader'
import Maecenate from '../models/maecenate'

export function getMaecenate (req, res, next) {
  const { slug } = req.params
  return Maecenate.where({ slug }).fetch().then((maecenate) => {
    return res.json(normalizeResponse({ maecenates: maecenate }))
  })
}

export function getMaecenates (req, res, next) {
  return Maecenate.fetchAll().then((maecenates) => {
    return res.json(normalizeResponse({ maecenates }))
  })
}

export function createMaecenate (req, res, next) {
  const { userId } = req.user
  const { maecenate: data } = req.body
  const { logo_url: logoUrl, cover_url: coverUrl } = data

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

    if (coverUrl) {
      const path = `maecenate/${maecenate.id}-cover`
      imageUploads.push(uploadDataUri(coverUrl, path).then((result) => {
        maecenate.set('cover_url', result.secure_url)
      }))
    }

    return Promise.all(imageUploads)
  }).then(() => {
    return maecenate.save(null, { method: 'insert' })
  }).then((model) => {
    return res.json(normalizeResponse({ maecenates: model }))
  }).catch(next)
}
