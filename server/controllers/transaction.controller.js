import json2csv from 'json2csv'
import { apiURL } from '../../shared/config'
import * as service from '../services/transactions'
import * as maecenateService from '../services/maecenates'
import * as subscriptionService from '../services/subscriptions'
import * as userService from '../services/users'
import { emailSupportReceipt } from '../services/emailSender'
import * as epayUtil from '../../shared/lib/epay'

export function maecenateInitiatePayment (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { amount, maecenateId, setupNewCard } = req.body

  const activeSubPeriod = subscriptionService.fetchActiveUserSubPeriodForMaecenate(
    knex, userId, maecenateId
  )

  return Promise.all([
    activeSubPeriod,
    maecenateService.activeExists(knex, maecenateId)
  ])
  .then(([period, activeMaecenateExists]) => {
    // The user already has an active period stop payment
    if (period) {
      const error = { _: 'maecenate.alreadySupported' }
      throw error
    }

    if (activeMaecenateExists === false) {
      const error = { _: 'maecenate.doesNotExist' }
      throw error
    }

    return userService.fetchPaymentInfo(knex, userId)
    .then(info => {
      // Use the old payment options if they exist, and the user hasn't
      // chosen to setup a new payment card
      if (info.epay_subscription_id && setupNewCard !== true) {
        return authorizeMaecenateSubscription(
          knex, userId, info.epay_subscription_id, maecenateId, amount
        )
        .then(result => res.json({ paymentComplete: result }))
      } else {
        return setupFirstTimePayment(knex, userId, maecenateId, amount)
        .then(epayPaymentParams =>
          res.json({ paymentComplete: false, epayPaymentParams })
        )
      }
    })
  })
  .catch(next)
}

function setupFirstTimePayment (knex, userId, maecenateId, amount) {
  return service.createPayment(knex, {
    paymentType: service.SUPPORT_MAECENATE,
    userId,
    maecenateId,
    amount,
    currency: 'DKK'
  })
  .then(epayOptions => ({
    ...epayOptions,
    windowid: String(process.env.EPAY_WINDOW_ID),
    paymentcollection: '1',
    lockpaymentcollection: '1',
    instantcallback: '1',
    subscription: '1',
    instantcapture: '1', // We take the money right away
    callbackurl: `${apiURL}/transactions/payment-callback`
  }))
}

function authorizeMaecenateSubscription (
  knex, userId, epaySubscriptionId, maecenateId, amount
) {
  const paymentType = service.SUPPORT_MAECENATE
  return service.authorizePayment(knex, {
    paymentType,
    userId,
    epaySubscriptionId,
    maecenateId,
    amount,
    currency: 'DKK'
  })
  .then(transaction => {
    if (transaction) {
      return subscriptionService.startSubscription(knex, transaction)
      .then(() => emailSupportReceipt(knex, transaction.id))
      .then(() => true)
    }
    return false
  })
}

export function paymentCallback (req, res, next) {
  const { knex } = req.app.locals
  const {
    txnid,
    orderid,
    subscriptionid,
    cardno,
    paymenttype
  } = req.query

  const amount = Number(req.query.amount)
  const fee = Number(req.query.txnfee)
  const bin = req.query.cardno.substr(0, 6)

  return epayUtil.getIssuerFromPaymentTypeAndBin(
    Number(paymenttype),
    bin
  )
  .then((cardIssuer) => {
    return service.verifyPayment(knex, orderid, amount)
    .then(({valid, verified}) => {
      // The payment is already verified
      if (verified === true) {
        return res.json({ success: true })
      }

      // The payment is valid
      if (valid === true) {
        return service.paymentSuccess(knex, orderid, txnid, fee)
        .then(transaction =>
          userService.savePaymentInfo(
            knex,
            transaction.user,
            subscriptionid,
            cardno,
            cardIssuer
          )
          .then(() => subscriptionService.startSubscription(knex, transaction))
          .then(() => emailSupportReceipt(knex, transaction.id))
        )
        .then(() => res.json({ success: true }))

      // The payment is __not__ valid
      } else {
        return service.paymentFailed(knex, orderid)
        .then(support => res.json({ success: false }))
      }
    })
  })
  .catch(next)
}

export function cronRefreshSubscriptions (req, res, next) {
  const { knex } = req.app.locals

  // We should not wait with responding until we're finished, as refreshing
  // all expiring subscriptions potentially could take a loooong time as we need
  // a response from epay every time we refresh a subscription
  subscriptionService.refreshExpiringSubscriptions(knex)
  return res.json({ success: true })
}

export function csvExtract (req, res, next) {
  const { knex } = req.app.locals
  if (req.params.code !== process.env.CSV_EXTRACT_CODE) {
    res.status(404).send('Not Found')
  }

  return knex('transactions')
    .select(
      'created_at as timestamp',
      'maecenates.title as maecenateTitle',
      'maecenates.id as maecenateID',
      'creator.id as creatorID',
      'creator.email as creatorEmail',
      'supporter.id as supporterID',
      'supporter.email as supporterEmail',
      'supporter.country as supporterCountry',
      'amount',
      'currency',
      'fee',
      'type'
    )
    .innerJoin('maecenates', 'transactions.maecenate', 'maecenates.id')
    .innerJoin('users as creator', 'maecenates.creator', 'creator.id')
    .innerJoin('users as supporter', 'transactions.user', 'supporter.id')
    .where('transactions.status', 'success')
    .then((data) => {
      // Write out the date in a good format
      data = data.map(transaction => ({
        ...transaction,
        timestamp: (new Date(transaction.timestamp)).toISOString()
      }))

      const fields = [
        'timestamp',
        'maecenateTitle',
        'maecenateID',
        'creatorID',
        'creatorEmail',
        'supporterID',
        'supporterEmail',
        'supporterCountry',
        'amount',
        'currency',
        'fee',
        'type'
      ]

      const csv = json2csv({ data, fields })
      res.setHeader('Content-disposition', 'attachment; filename=transactions.csv')
      res.set('Content-Type', 'text/csv')
      res.status(200).send(csv)
    })
    .catch(next)
}
