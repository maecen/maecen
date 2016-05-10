import { formatResponseError, normalizeResponse } from '../util/ctrlHelpers'
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
  const { logoUrl, coverUrl } = data

  let maecenate = new Maecenate(data)

  return maecenate.validate().then(() => {
    let imageUploads = []

    // Do the upload after the save! (so we validate first)
    if (logoUrl) {
      const path = `maecenate/${maecenate._id}-logo`
      imageUploads.push(uploadDataUri(logoUrl, path).then((result) => {
        maecenate.logoUrl = result.secure_url
      }))
    }

    if (coverUrl) {
      const path = `maecenate/${maecenate._id}-cover`
      imageUploads.push(uploadDataUri(coverUrl, path).then((result) => {
        maecenate.coverUrl = result.secure_url
      }))
    }

    return Promise.all(imageUploads)
  }).then(() => {
    return maecenate.save()
  }).then(() => {
    return res.json(normalizeResponse({ maecenates: maecenate }))
  }).catch((error) => {
    const errors = formatResponseError(error)
    return res.status(400).json({ errors })
  })
}
