import { formatMongooseError, normalizeResponse } from '../util/ctrlHelpers'
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

  let maecenate = new Maecenate(data)

  return maecenate.save((error) => {
    if (error) {
      const errors = formatMongooseError(error)
      return res.status(400).json({ errors })
    }

    return res.json(normalizeResponse({ maecenates: maecenate }))
  })
}
