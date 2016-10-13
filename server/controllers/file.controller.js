import multiparty from 'multiparty'
import { normalizeResponse } from '../util/ctrlHelpers'
import { uploadMediaStream, uploadFileStream } from '../services/files'

export function uploadMedia (req, res, next) {
  const { knex } = req.app.locals
  return uploadFileReq(knex, req, uploadMediaStream)
  .then((media) => {
    return res.json(normalizeResponse({ media }))
  })
  .catch(next)
}

export function uploadFile (req, res, next) {
  const { knex } = req.app.locals
  return uploadFileReq(knex, req, uploadFileStream)
  .then((files) => {
    return res.json(normalizeResponse({ files }))
  })
  .catch(next)
}

const uploadFileReq = (knex, req, uploadStream) => {
  return new Promise((resolve, reject) => {
    let files = []
    const form = new multiparty.Form({ autoFields: true })
    form.on('part', (part) => {
      const type = part.headers['content-type']
      const match = part.headers['content-disposition'].match(/filename="(.*)"$/)
      const filename = match[1]
      files.push(uploadStream(knex, part, { type, filename }).catch(reject))
    })
    form.on('error', reject)
    form.on('close', () => Promise.all(files).then(resolve))
    form.parse(req)
  })
}
