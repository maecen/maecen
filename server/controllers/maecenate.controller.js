import { normalizeResponse } from '../util/ctrlHelpers'
import * as service from '../services/maecenates'
import * as subscriptionService from '../services/subscriptions'
import { knex } from '../database'
import { emailMaecenateDeactivated } from '../services/emailSender'
import * as emailService from '../services/email'

export function getMaecenate (req, res, next) {
  const { slug } = req.params
  const userId = req.user ? req.user.userId : null

  return service.fetchMaecenate({ slug }, userId)
  .then((result) => {
    const { maecenate, supports } = result
    return res.json(normalizeResponse({
      maecenates: maecenate,
      supports
    }, 'maecenates'))
  })
  .catch(next)
}

export function getAdminDetails (req, res, next) {
  const { knex } = req.app.locals
  const { slug } = req.params

  return service.fetchMaecenateAdminDetails(knex, { slug })
  .then(details => {
    res.json(normalizeResponse({ maecenateDetails: details }))
  })
  .catch(next)
}

export function getMaecenates (req, res, next) {
  return service.fetchMaecenates({ active: true })
  .then((maecenates) => {
    return res.json(normalizeResponse({
      maecenates
    }))
  })
  .catch(next)
}

export function createMaecenate (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { maecenate: data } = req.body

  return service.createMaecenate(knex, userId, data)
  .then((id) => service.fetchMaecenate({ id }))
  .then((result) => {
    return res.json(normalizeResponse({
      maecenates: result.maecenate
    }))
  })
  .catch(next)
}

export function editMaecenate (req, res, next) {
  const { knex } = req.app.locals
  const { maecenate } = req.body

  return service.updateMaecenate(knex, maecenate.id, maecenate)
  .then(() => service.fetchMaecenate({ id: maecenate.id }))
  .then(result => {
    return res.json(normalizeResponse({
      maecenates: result.maecenate
    }))
  })
  .catch(next)
}

export function getMaecenateSupporters (req, res, next) {
  const { slug } = req.params
  const maecenateIdQuery = knex('maecenates').where({ slug }).select('id').limit(1)

  return service.fetchMaecenateSupporters(maecenateIdQuery)
  .then((result) => {
    return res.json(normalizeResponse(result, 'users'))
  })
  .catch(next)
}

export function deactivateMaecenate (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { maecenateId } = req
  const { message } = req.body

  console.log('deactivateMaecenate()')

  return service.deactivateMaecenate(knex, maecenateId)
  .then(() => {
    return emailService.fetchMaecenateDeactivatedData(knex, maecenateId)
  })
  .then(emailData => {
    return subscriptionService.stopAllSupporterSubscriptions(knex, maecenateId)
    .then(() => {
      return emailMaecenateDeactivated(knex, emailData, message)
    })
  })
  .then(() => {
    return service.fetchMaecenate({ id: maecenateId }, userId)
  })
  .then(({ maecenate, supports }) => {
    return res.json(normalizeResponse({
      maecenates: maecenate,
      supports
    }, 'maecenates'))
  })
  .catch(next)
}

export function getFeed (req, res, next) {
  const { slug } = req.params
  let posts = null

  const maecenateQuery = knex('maecenates').where('slug', slug).select('id')
  return knex('posts')
  .where('maecenate', 'in', maecenateQuery)
  .orderBy('created_at', 'desc')
  .then((res) => {
    posts = res
    const postIds = posts.map(post => post.id)
    return knex('media').where('obj_id', 'in', postIds)
      .andWhere('obj_type', 'post')
  })
  .then(media => {
    posts = posts.map(post => ({
      ...post,
      media: media.filter(m => m.obj_id === post.id)
    }))

    res.json(normalizeResponse({ posts }))
  })
  .catch(next)
}
