import Joi from 'joi'
import uuid from 'node-uuid'
import { uploadStream } from '../util/fileUploader'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'

const schema = {
  id: Joi.string().guid(),
  post: Joi.string().guid(),
  url: Joi.string().max(255),
  type: Joi.string().max(20)
}

const PostMedia = bookshelf.Model.extend({
  tableName: 'post_media',

  initialize () {
    this.on('saving', this.validate, this)
  },

  generateId () {
    if (!this.has('id')) {
      this.set('id', uuid.v1())
    }
  },

  validate (model, attrs, options) {
    if (options && options.force === true) {
      return true
    }

    return joiValidation(this.toJSON(true), schema)
  }
})

PostMedia.uploadStream = function (stream, attr) {
  let postMedia = new PostMedia(attr)
  postMedia.generateId()
  const path = `media/${postMedia.id}`
  return postMedia.validate().then(() => {
    const type = attr.type.startsWith('video') ? 'video' : 'image'
    return uploadStream(stream, path, type)
  }).then((result) => {
    postMedia.set('url', result.secure_url)
    return postMedia.save(null, { method: 'insert' })
  })
}

export default PostMedia

