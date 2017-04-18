// Imports
import json2csv from 'json2csv'
import { normalizeResponse } from '../util/ctrlHelpers'
import { postStatus } from '../../shared/config'

// Services
import * as service from '../services/maecenates'
import * as subscriptionService from '../services/subscriptions'
import {
  emailMaecenateDeactivated,
  emailToSupporters
} from '../services/emailSender'
import * as emailService from '../services/email'
import {
  populateMaecenatesWithMedia,
  populatePostsWithFiles
} from '../services/files'

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

export function getMaecenatesOverview (req, res, next) {
  const { knex } = req.app.locals
  return service.fetchMaecenatesOverview(knex)
    .then(maecenates => populateMaecenatesWithMedia(knex, maecenates))
    .then(maecenates => res.json(normalizeResponse({ maecenates })))
}

export function getMaecenates (req, res, next) {
  return service.fetchMaecenates({ active: true })
    .then(maecenates => res.json(normalizeResponse({ maecenates })))
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
  const { knex } = req.app.locals
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
  const { knex } = req.app.locals
  const { userId } = req.user
  const { slug } = req.params

  const maecenateQuery = knex('maecenates').where('slug', slug).select('id')
  let feedQuery = knex('posts')
    .where('maecenate', 'in', maecenateQuery)
    .orderBy('created_at', 'desc')

  return Promise.all([
    service.userIsSupporterBySlug(knex, slug, userId),
    service.userIsAdminBySlug(knex, slug, userId)
  ])
    .then(([isSupporter, isAdmin]) => {
      if (isSupporter === false && isAdmin === false) {
        const error = { _: 'maecenate.userIsNotSupporter' }
        throw error
      }

      if (isAdmin === false) {
        feedQuery = feedQuery.where('status', postStatus.PUBLISHED)
      }

      return feedQuery
    })
    .then(posts => populatePostsWithFiles(knex, posts))
    .then(posts => res.json(normalizeResponse({ posts })))
    .catch(next)
}

export function sendEmailToSupporters (req, res, next) {
  const { knex } = req.app.locals
  const { message, subject } = req.body
  const { maecenateId } = req

  const formattedMessage = message.replace(/\n/g, '<br />')

  return emailToSupporters(knex, maecenateId, subject, formattedMessage)
    .then(() =>
      res.json({
        success: true
      })
    )
    .catch(next)
}

export function csvExtract (req, res, next) {
  const { knex } = req.app.locals
  if (req.params.code !== process.env.CSV_EXTRACT_CODE) {
    res.status(404).send('Not Found')
  }

  const date = new Date

  return knex('maecenates')
    .select(
      'title',
      'maecenates.id',
      'creator.id as creatorID',
      'creator.email as creatorEmail',
      //'supporters'
    )
    .innerJoin('users as creator', 'maecenates.creator', 'creator.id')
    //.innerJoin('subscriptions', 'subscriptions.maecenate', 'maecenates.id')
    //.innerJoin('sub_periods as supporters', 'supporters.subscription', 'subscriptions.id')
    .then((data) => {
      data = data.map(transaction => ({
        ...transaction,
        //supporters: transaction.supporters.length
      }))

      const fields = [
        'title',
        'id',
        'creatorID',
        'creatorEmail',
        //'supporters'
      ]

      const csv = json2csv({ data, fields })
      res.setHeader('Content-disposition', 'attachment; filename=transactions.csv')
      res.set('Content-Type', 'text/csv')
      res.status(200).send(csv)
    })
    .catch(next)
}
