import Joi from 'joi'
import uuid from 'node-uuid'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'
import Media from './Media'

const schema = Joi.object({
  id: Joi.string().guid(),
  title: Joi.string(),
  maecenate: Joi.string().guid().required(),
  author: Joi.string().guid().required(),
  author_alias: Joi.string().required(),
  content: Joi.string().allow(null, ''),
  media: [Joi.any().allow(null, '')]
}).or('media', 'content')

const Post = bookshelf.Model.extend({
  tableName: 'posts',

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
  },

  media () {
    return this.hasMany(Media, 'obj_id')
  }
})

export default Post
