import uuid from 'node-uuid'
import { normalizeResponse } from '../util/ctrlHelpers'
import { uploadDataUri } from '../util/fileUploader'
import { knex } from '../database'
import Maecenate from '../models/Maecenate'

export function getMaecenate (req, res, next) {
  const { slug } = req.params
  const userId = req.user ? req.user.userId : null
  let maecenate = null

  return Maecenate.where({ slug }).fetch().then((data) => {
    if (data === null) {
      const error = { maecenate: 'noneExists' }
      throw error
    }
    maecenate = data
  }).then(() => {
    return Promise.all([
      knex('media').where('id', maecenate.get('cover_media')),
      getMaecenateUserSupports(maecenate.id, userId)
    ])
  }).then(([media, supports]) => {
    console.log(supports)
    return res.json(normalizeResponse({
      maecenates: maecenate, media, supports
    }, 'maecenates'))
  }).catch(next)
}

export function getMaecenates (req, res, next) {
  let maecenates = null
  return Maecenate.fetchAll().then((res) => {
    maecenates = res
    return knex('media')
      .where('id', 'in', maecenates.map(obj => obj.get('cover_media')))
  }).then((media) => {
    return res.json(normalizeResponse({
      maecenates, media
    }, 'maecenates'))
  }).catch(next)
}

export function getUserMaecenates (req, res, next) {
  const { user } = req.params
  return Maecenate.where({ creator: user }).fetchAll().then((maecenates) => {
    return res.json(normalizeResponse({ maecenates }))
  }).catch(next)
}

export function createMaecenate (req, res, next) {
  const { userId } = req.user
  const { maecenate: data } = req.body
  const { logo_url: logoUrl, cover_media: coverMedia } = data

  let mediaIds = [coverMedia]
  let maecenate = new Maecenate(data)
  maecenate.generateId()
  maecenate.set('creator', userId)

  return maecenate.validate().then(() => {
    let imageUploads = []

    // Do the upload after the save! (so we validate first)
    if (logoUrl) {
      const path = `maecenate/${maecenate.id}-logo`
      imageUploads.push(uploadDataUri(logoUrl, path).then((result) => {
        maecenate.set('logo_url', result.secure_url)
      }))
    }

    return Promise.all(imageUploads)
  }).then(() => {
    return maecenate.save(null, { method: 'insert' }).then(() => {
      return knex('media')
        .where('id', 'in', mediaIds)
        .andWhere('obj_id', null)
        .update({
          obj_id: maecenate.get('id'),
          obj_type: 'maecenate'
        })
    })
  }).then(() => {
    return knex('media')
      .where('obj_id', maecenate.id)
      .andWhere('obj_type', 'maecenate')
  }).then((media) => {
    return res.json(normalizeResponse({
      maecenates: maecenate, media }, 'maecenates'))
  }).catch(next)
}

export function supportMaecenate (req, res, next) {
  const { userId } = req.user
  const { maecenateId, amount } = req.body

  if (amount < 0) {
    const error = {
      amount: { message: 'validationError.numberMin' }, options: { limit: 0 }
    }
    throw error
  }

  return Promise.all([
    isUserSupportingMaecenate(maecenateId, userId),
    Maecenate.isUserOwner(maecenateId, userId)
  ]).then(([ isSupporting, isOwner ]) => {
    if (isSupporting === true) {
      const error = { _: 'mc.alreadySupported' }
      throw error
    }

    if (isOwner === true) {
      const error = { _: 'mc.ownersCannotSupport' }
      throw error
    }

    const support = {
      id: uuid.v1(),
      user: userId,
      maecenate: maecenateId,
      amount
    }

    return knex('supporters').insert(support).then(() => support)
  }).then(support => {
    return res.json(normalizeResponse({ supports: support }))
  }).catch(next)
}

export function getSupportedMaecenates (req, res, next) {
  const userId = req.params.user

  let supports = null
  return knex('supporters').where('user', userId).then(res => {
    supports = res
    const maecenateIds = supports.map(support => support.maecenate)
    return knex('maecenates').where('id', 'in', maecenateIds)
  }).then(maecenates => {
    return res.json(normalizeResponse({ maecenates, supports }, 'maecenates'))
  }).catch(next)
}

export function getMaecenateSupporters (req, res, next) {
  const { slug } = req.params

  const maecenateIdQuery = knex('maecenates').where({ slug }).select('id')
  let supports = null

  return knex('supporters').where('maecenate', maecenateIdQuery).then(result => {
    supports = result
    const userIds = supports.map(support => support.user)
    return knex('users').where('id', 'in', userIds)
      .select('first_name', 'country', 'id').orderBy('created_at', 'desc')
  }).then(users => {
    return res.json(normalizeResponse({
      users, supports
    }, 'users'))
  }).catch(next)
}

function getMaecenateUserSupports (maecenateId, userId) {
  if (userId) {
    return knex('supporters')
      .where('user', userId)
      .andWhere('maecenate', maecenateId)
  }
}

function isUserSupportingMaecenate (maecenateId, userId) {
  return knex('supporters')
    .where('user', userId).andWhere('maecenate', maecenateId).count('* as count')
    .then(res => res[0].count >= 1)
}

