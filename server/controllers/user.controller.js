import { normalizeResponse } from '../util/ctrlHelpers'
import User from '../models/User'
import Maecenate from '../models/Maecenate'

export function createUser (req, res, next) {
  let { user: data } = req.body
  if (data.email) {
    data.email = data.email.toLowerCase()
  }

  let user = new User(data)
  user.generateId()

  user.save(null, { method: 'insert' }).then((model) => {
    createUserAuthTokenInRes(model, res)
    return res.json(normalizeResponse({ users: model }))
  }).catch(next)
}

export function updateAuthUser (req, res, next) {
  if (!req.user) return res.status(401).json()

  const { userId } = req.user
  let data = req.body.user
  delete data.password // User can't update password here

  return User.where('id', userId).fetch().then(user => {
    user.set(data)
    return user.save()
  }).then(user => {
    return res.json(normalizeResponse({ users: user }))
  }).catch(next)
}

export function getAuthUser (req, res, next) {
  const { userId } = req.user

  return User.where('id', userId).then(user => {
    return res.json(normalizeResponse({ users: user }))
  }).catch(next)
}

export function authUser (req, res, next) {
  const { credentials } = req.body
  const email = (credentials.email || '').toLowerCase()
  const password = credentials.password || ''

  User.authenticate(email, password).then(user => {
    createUserAuthTokenInRes(user, res)
    return res.json(normalizeResponse({ users: user }))
  }).catch(next)
}

export function clearAuth (req, res, next) {
  res.clearCookie('id_token', { httpOnly: true })
  return res.json({success: true})
}

export function setUserLanguage (req, res, next) {
  const {lng} = req.body
  const expire = 365 * 24 * 60 * 60 // in 1 year
  res.cookie('i18n', lng, { maxAge: 1000 * expire, httpOnly: true })
  return res.json({success: true})
}

export function hasPermission (req, res, next) {
  const userId = req.user && req.user.userId || null
  const { area, id } = req.params

  let permissionPromise = null

  switch (area) {
    case 'maecenateAdmin':
      permissionPromise = Maecenate.isUserAdminBySlug(id, userId)
  }

  return permissionPromise.then(hasPermission => {
    if (hasPermission === true) {
      return res.json({ hasPermission })
    } else {
      return res.status(401).json({ hasPermission })
    }
  }).catch(next)
}

function createUserAuthTokenInRes (user, res) {
  const expiresIn = 60 * 60 * 24 * 30 // 30 days
  const token = User.createToken(user.id, expiresIn)
  res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true })
}
