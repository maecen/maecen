import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'
import { promisify } from 'bluebird'
import { formatMongooseError, normalizeResponse } from '../util/ctrlHelpers'
import * as config from '../../shared/config'
import User from '../models/user'

const bcryptCompare = promisify(bcrypt.compare)

export function createUser (req, res, next) {
  const { user: data } = req.body

  let user = new User(data)

  user.save((error) => {
    if (error) {
      const errors = formatMongooseError(error)
      return res.status(400).json({ errors })
    }

    // Maybe auth the user instead, could just use this as middleware
    return res.json(normalizeResponse({ users: user }))
  })
}

export function updateAuthUser (req, res, next) {
  if (!req.user) return res.status(401).json()

  const { userId } = req.user
  const data = req.body.user

  return User.findById(userId).then((user) => {
    user.set(data)
    return user.save(userResponseHandler(res, user))
  }).catch(next)
}

export function getAuthUser (req, res, next) {
  const { userId } = req.user
  User.findById(userId, '-password').then((user) => {
    return res.json(normalizeResponse({ users: user }))
  }).catch(next)
}

export function authUser (req, res, next) {
  const { credentials: { email, password } } = req.body

  User.findOne({ email: email.toLowerCase() }).then((user) => {
    if (user !== null) {
      return bcryptCompare(password, user.password).then(match => {
        if (match === true) {
          return user
        }
        return 'This password doesn\'t match the email'
      })
    } else {
      return 'No user exists with this email'
    }
  }).then(arg => {
    if (typeof arg === 'string') {
      return res.status(500).json({ errors: { general: arg } })
    }

    const user = arg.toObject()

    const expiresIn = 60 * 60 * 24 * 30 // 30 days
    const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn })
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true })

    delete user.password
    return res.json(normalizeResponse({ users: user }))
  }).catch(next)
}

export function clearAuth (req, res, next) {
  res.clearCookie('id_token', { httpOnly: true })
  res.json({success: true})
}

export function setUserLanguage (req, res, next) {
  const {lng} = req.body
  const expire = 365 * 24 * 60 * 60 // in 1 year
  res.cookie('i18n', lng, { maxAge: 1000 * expire, httpOnly: true })
  res.json({success: true})
}

function userResponseHandler (res, user) {
  return (error) => {
    if (error) {
      const errors = formatMongooseError(error)
      return res.status(400).json({ errors })
    }

    let obj = user.toJSON()
    delete obj.password

    return res.json(normalizeResponse({ users: obj }))
  }
}
