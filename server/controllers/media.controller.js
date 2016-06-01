import multiparty from 'multiparty'
import { normalizeResponse } from '../util/ctrlHelpers'
import Media from '../models/Media'

export function uploadMedia (req, res, next) {
  return new Promise((resolve, reject) => {
    let media = []
    const form = new multiparty.Form({ autoFields: true })
    form.on('part', (part) => {
      const type = part.headers['content-type']
      media.push(Media.uploadStream(part, { type }))
    })
    form.on('error', reject)
    form.on('close', () => {
      Promise.all(media).then(resolve).catch(reject)
    })
    form.parse(req)
  }).then((media) => {
    return res.json(normalizeResponse({ media }))
  }).catch(next)
}
