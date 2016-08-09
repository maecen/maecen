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

  return service.fetchMaecenateSupporters(maecenateIdQuery)
  .then((result) => {
    return res.json(normalizeResponse(result, 'users'))
  }).catch(next)
}

/*
function isUserSupportingMaecenate (maecenateId, userId) {
  return knex('supporters')
    .where('user', userId).andWhere('maecenate', maecenateId).count('* as count')
    .then(res => Number(res[0].count) >= 1)
}
*/
