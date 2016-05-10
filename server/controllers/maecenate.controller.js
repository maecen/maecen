import { formatMongooseError, normalizeResponse } from '../util/ctrlHelpers'
import { uploadDataUri } from '../util/fileUploader'
import Maecenate from '../models/maecenate'

export function getMaecenate (req, res, next) {
  const { slug } = req.params
  return Maecenate.findOne({ slug }).then((maecenate) => {
    return res.json(normalizeResponse({ maecenates: maecenate }))
  })
}

export function getMaecenates (req, res, next) {
  return Maecenate.find().then((maecenates) => {
    return res.json(normalizeResponse({ maecenates }))
  })
}

export function createMaecenate (req, res, next) {
  const { maecenate: data } = req.body
  let { logoDataUri, coverDataUri } = data

  delete data.logoDataUri
  delete data.coverDataUri

  let maecenate = new Maecenate(data)

  return Promise.resolve().then(() => {
    let imageUploads = []

    // Do the upload after the save! (so we validate first)
    if (logoDataUri) {
      const path = `maecenate/${maecenate._id}-logo`
      imageUploads.push(uploadDataUri(logoDataUri, path).then((result) => {
        maecenate.logoUrl = result.secure_url
      }))
    }

    if (coverDataUri) {
      const path = `maecenate/${maecenate._id}-cover`
      imageUploads.push(uploadDataUri(coverDataUri, path).then((result) => {
        maecenate.coverUrl = result.secure_url
      }))
    }

    return Promise.all(imageUploads)
  }).then(() => {
    maecenate.save((error) => {
      if (error) {
        const errors = formatMongooseError(error)
        return res.status(400).json({ errors })
      }

      return res.json(normalizeResponse({ maecenates: maecenate }))
    })
  }).catch(next)
}
