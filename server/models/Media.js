import Joi from 'joi'
import uuid from 'node-uuid'
import { uploadStream } from '../util/fileUploader'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'

const schema = {
  id: Joi.string().guid(),
  obj_id: Joi.string().guid(),
  obj_type: Joi.string(),
  url: Joi.string().max(255),
  type: Joi.string().max(20)
}

const Media = bookshelf.Model.extend({
  tableName: 'media',

  initialize () {
    this.on('saving', this.validate, this)
  },

  generateId () {
    if (!this.has('id')) {
      this.set('id', uuid.v4())
    }
  },

  validate (model, attrs, options) {
    if (options && options.force === true) {
      return true
    }

    return joiValidation(this.toJSON(true), schema)
  }
})

Media.uploadStream = function (stream, attr) {
  let media = new Media(attr)
  media.generateId()
  const path = `media/${media.id}`
  return media.validate().then(() => {
    const type = attr.type.startsWith('video') ? 'video' : 'image'
    return uploadStream(stream, path, type)
  }).then((result) => {
    media.set('url', result.secure_url)
    return media.save(null, { method: 'insert' })
  })
}

export default Media

