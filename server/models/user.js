import { promisify } from 'bluebird'
import bcrypt from 'bcrypt-nodejs'
import Joi from 'joi'
import uuid from 'node-uuid'
import { joiValidation } from '../util/ctrlHelpers'
import { bookshelf } from '../database'

const bcryptCompare = promisify(bcrypt.compare)
const SALT_WORK_FACTOR = 10

const schema = {
  id: Joi.string().guid(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().required(),
  alias: Joi.string().allow(null, ''),
  phone_number: Joi.string().allow(null, ''),
  country: Joi.string().allow(null, ''),
  zip_code: Joi.string().allow(null, '')
}

const User = bookshelf.Model.extend({
  tableName: 'users',

  initialize () {
    this.on('saving', this.validate, this)
    this.on('creating', this.hashPassword, this)
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
          return User.where('email', this.get('email')).count().then(count => {
            if (count > 0) {
              const error = { email: 'validationError.alreadyTaken' }
              throw error
            }
          })
        }
      })
  },

  toJSON: function (includePassword) {
    let json = bookshelf.Model.prototype.toJSON.apply(this, arguments)
    if (!includePassword) {
      delete json.password
    }
    return json
  },

  hashPassword () {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return reject(err)

        bcrypt.hash(this.get('password'), salt, null, (err, hash) => {
          if (err) return reject(err)
          this.set('password', hash)
          resolve(hash)
        })
      })
    })
  }
})

User.authenticate = function (email, password) {
  let user
  return User.where('email', email).fetch().then((model) => {
    user = model
    if (user !== null) {
      return bcryptCompare(password, user.get('password'))
    } else {
      // No user with this email error
      const error = { email: 'error.noUserWithEmail' }
      throw error
    }
  }).then(match => {
    if (match === false) {
      // Password not correct
      const error = { password: 'error.passwordIncorrect' }
      throw error
    }
    return user
  })
}

export default User
