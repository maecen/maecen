import uuid from 'node-uuid'
import { normalizeResponse } from '../util/ctrlHelpers'
import * as service from '../services/maecenates'
import { knex } from '../database'
import Maecenate from '../models/Maecenate'

export function getMaecenate (req, res, next) {
  const { slug } = req.params
  const userId = req.user ? req.user.userId : null

  service.fetchMaecenate({ slug }, userId).then((result) => {
    const { maecenate, supports } = result
    return res.json(normalizeResponse({
      maecenates: maecenate,
      supports
    }, 'maecenates'))
  }).catch(next)
}

export function getMaecenates (req, res, next) {
  service.fetchMaecenates().then((maecenates) => {
    return res.json(normalizeResponse({
      maecenates
    }))
  }).catch(next)
}

export function getUserMaecenates (req, res, next) {
  const { user } = req.params
  service.fetchMaecenates({ creator: user }).then((maecenates) => {
    return res.json(normalizeResponse({
      maecenates
    }))
  }).catch(next)
}

export function createMaecenate (req, res, next) {
  const { userId } = req.user
  const { maecenate: data } = req.body
  const { logo_media: logoMedia, cover_media: coverMedia } = data

  let mediaIds = [coverMedia, logoMedia]
  let maecenate = new Maecenate(data)
  maecenate.generateId()
  maecenate.set('creator', userId)

  return maecenate.validate().then(() => {
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
    return service.fetchMaecenate({ id: maecenate.id })
  }).then((result) => {
    return res.json(normalizeResponse({
      maecenates: result.maecenate
    }))
  }).catch(next)
}

export function editMaecenate (req, res, next) {
  const { maecenate } = req.body
  return service.updateMaecenate(maecenate.id, maecenate).then(() => {
    return service.fetchMaecenate({ id: maecenate.id })
  }).then((result) => {
    return res.json(normalizeResponse({
      maecenates: result.maecenate
    }))
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
      const error = { _: 'maecenate.alreadySupported' }
      throw error
    }

    if (isOwner === true) {
      const error = { _: 'maecenate.ownersCannotSupport' }
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

  return service.fetchSupportedMaecenates(userId).then((result) => {
    const { maecenates, supports } = result
    return res.json(normalizeResponse({
      maecenates,
      supports
    }, 'maecenates'))
  }).catch(next)
}

export function getMaecenateSupporters (req, res, next) {
  const { slug } = req.params

  const maecenateIdQuery = knex('maecenates').where({ slug }).select('id').limit(1)
  let supports = null

  return knex('supporters').where('maecenate', maecenateIdQuery)
  .orderBy('created_at', 'desc')
  .then(result => {
    supports = result
    const userIds = supports.map(support => support.user)
    return knex('users').where('id', 'in', userIds)
      .select('first_name', 'country', 'id')
  }).then(users => {
    return res.json(normalizeResponse({
      users, supports
    }, 'users'))
  }).catch(next)
}

function isUserSupportingMaecenate (maecenateId, userId) {
  return knex('supporters')
    .where('user', userId).andWhere('maecenate', maecenateId).count('* as count')
    .then(res => Number(res[0].count) >= 1)
}

