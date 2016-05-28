import Joi from 'joi'
import uuid from 'node-uuid'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'

const schema = {
  id: Joi.string().guid(),
  title: Joi.string().required(),
  maecenate: Joi.string().guid().required(),
  author: Joi.string().guid().required(),
  author_alias: Joi.string().required(),
  content: Joi.string().required()
}

const Post = bookshelf.Model.extend({
  tableName: 'posts',

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

export default Post
