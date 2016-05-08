import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { promisifyAll } from 'bluebird'
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10

const toLowerCase = val => val.toLowerCase()

const userSchema = new Schema({
  name: {
    first: { type: String, required: [true, 'First name is required'] },
    last: { type: String, required: [true, 'Last name is required'] }
  },
  email: { type: String, required: [true, 'We need your email'],
    set: toLowerCase },
  password: { type: String, required: [true, 'Password is not entered'] }
})

const User = promisifyAll(mongoose.model('User', userSchema))
export default User

User.schema.path('email').validate(function (val, res) {
  if (this.isModified('email') === false) {
    return res(true)
  }

  User.findOne({ email: val.toLowerCase() }, '_id').then(function (user) {
    if (user) {
      res(false)
    } else {
      res(true)
    }
  }, function () { res(false) })
}, 'This email is already in use')

userSchema.pre('save', function (next) {
  let user = this

  if (user.isModified('password') === false) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})
