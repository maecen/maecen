import Joi from 'joi'
import { slugify } from 'strman'
import uuid from 'node-uuid'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'
import Media from './Media'

const urlRegex = /^(https?:\/\/)?[^$\/]+\..+$/i

const schema = {
  id: Joi.string().guid(),
  title: Joi.string().required(),
  slug: Joi.string(),
  creator: Joi.string().guid(),
  logo_media: Joi.string().guid().required(),
  cover_media: Joi.string().guid().required(),
  teaser: Joi.string().min(10).max(140).required(),
  description: Joi.string().min(30).required(),
  url: Joi.string().regex(urlRegex).allow(null, ''),
  monthly_minimum: Joi.number().required()
}

const Maecenate = bookshelf.Model.extend({
  tableName: 'maecenates',

  initialize () {
    this.on('saving', this.generateSlug, this)
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
      .then(() => {
        if (this.hasChanged('slug') === true) {
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
  },

  cover () {
    return this.belongsTo(Media, 'cover_media')
  }
})

Maecenate.isUserAdminBySlug = function (slug, userId) {
  return Maecenate.where({ slug, creator: userId }).count()
    .then(count => count > 0)
}

Maecenate.isUserAdmin = function (id, userId) {
  return Maecenate.where({ id, creator: userId }).count()
    .then(count => count > 0)
}

Maecenate.isUserOwner = Maecenate.isUserAdmin

export default Maecenate
