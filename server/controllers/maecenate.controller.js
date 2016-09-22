import { normalizeResponse } from '../util/ctrlHelpers'
import * as service from '../services/maecenates'
import * as subscriptionService from '../services/subscriptions'
import { knex } from '../database'
import Maecenate from '../models/Maecenate'
import { emailMaecenateDeactivated } from '../services/emailSender'
import * as emailService from '../services/email'

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
  service.fetchMaecenates({ active: true }).then((maecenates) => {
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

export function cancelSubscription (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { id } = req.params
  return subscriptionService.stopSubscription(knex, userId, id)
  .then((success) => {
    return subscriptionService.fetchActiveUserSubPeriodForMaecenate(knex, userId, id)
    .then((result) => {
      return res.json({
        ...normalizeResponse({ supports: result }),
        success: true
      })
    })
  }).catch(next)
}

export function deactivateMaecenate (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { id } = req.params
  const { message } = req.body

  return service.userIsAdmin(knex, id, userId)
  .then((isUserAdmin) => {
    if (isUserAdmin === false) {
      const error = { _: 'error.notOwnerOfMaecenate' }
      throw error
    } else {
      return service.deactivateMaecenate(knex, id)
    }
  }).then(() => {
    return emailService.fetchMaecenateDeactivatedData(knex, id)
  }).then(emailData => {
    return subscriptionService.stopAllSupporterSubscriptions(knex, id)
    .then(() => {
      return emailMaecenateDeactivated(knex, emailData, message)
    })
  }).then(() => {
    return service.fetchMaecenate({ id }, userId)
  }).then(({ maecenate, supports }) => {
    return res.json(normalizeResponse({
      maecenates: maecenate,
      supports
    }, 'maecenates'))
  }).catch(next)
}

