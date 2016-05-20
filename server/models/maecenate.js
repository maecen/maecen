import Joi from 'joi'
import { slugify } from 'strman'
import uuid from 'node-uuid'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'

const schema = {
  id: Joi.string().guid(),
  title: Joi.string().required(),
  slug: Joi.string(),
  creator: Joi.string().guid(),
  logo_url: Joi.string().required(),
  cover_url: Joi.string().required(),
  teaser: Joi.string().min(10).max(140).required(),
  description: Joi.string().min(30).required(),
  url: Joi.string().hostname().allow(null)
}

const Maecenate = bookshelf.Model.extend({
  tableName: 'maecenates',

  initialize () {
    this.on('saving', this.generateSlug, this)
    this.on('saving', this.validate, this)
  },

  generateId () {
    if (!this.has('id')) {
      this.set('id', uuid.v1())
    }
  },

  validate () {
    return joiValidation(this.toJSON(true), schema)
      .then(() => {
        if (this.hasChanged('email') === true) {
          return Maecenate.where('slug', this.get('slug')).count().then(count => {
            if (count > 0) {
              const error = { title: 'validationError.alreadyTaken' }
              throw error
            }
          })
        }
      })
  },

  generateSlug () {
    if (this.hasChanged('title') === true) {
      this.set('slug', slugify(this.get('title')))
    }
  }
})

export default Maecenate
