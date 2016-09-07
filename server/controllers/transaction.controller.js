import { apiURL } from '../../shared/config'
import * as service from '../services/transactions'
import * as subscriptionService from '../services/subscriptions'
import * as userService from '../services/users'
import { emailSupportReceipt } from '../services/emailSender'

export function maecenateInitiatePayment (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { amount, maecenateId } = req.body

  return subscriptionService.fetchActiveUserSubPeriodForMaecenate(
    knex, userId, maecenateId
  ).then((period) => {
    // The user already has an active period stop payment
    if (period) {
      const error = { _: 'maecenate.alreadySupported' }
      throw error
    }

    return userService.fetchPaymentInfo(knex, userId)
    .then(info => {
      if (info.epay_subscription_id) {
        return authorizeMaecenateSubscription(
          knex, userId, info.epay_subscription_id, maecenateId, amount
        ).then(result => {
          return res.json({
            paymentComplete: result
          })
        })
      } else {
        return setupFirstTimePayment(knex, userId, maecenateId, amount)
        .then(epayPaymentParams => {
          return res.json({
            paymentComplete: false,
            epayPaymentParams
          })
        })
      }
    })
  }).catch(next)
}

function setupFirstTimePayment (knex, userId, maecenateId, amount) {
  return service.createPayment(knex, {
    paymentType: service.SUPPORT_MAECENATE,
    userId,
    maecenateId,
    amount,
    currency: 'DKK'
  }).then(epayOptions => {
    const epayPaymentParams = {
      ...epayOptions,
      windowid: String(process.env.EPAY_WINDOW_ID),
      paymentcollection: '1',
      lockpaymentcollection: '1',
      instantcallback: '1',
      subscription: '1',
      instantcapture: '1', // We take the money right away
      callbackurl: `${apiURL}/transactions/payment-callback`
    }

    return epayPaymentParams
  })
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
  }).then(transaction => {
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
    cardno
  } = req.query

  const amount = Number(req.query.amount)

  return service.verifyPayment(knex, orderid, amount)
  .then(({valid, verified}) => {
    // The payment is already verified
    if (verified === true) {
      return res.json({ success: true })
    }

    // The payment is valid
    if (valid === true) {
      return service.paymentSuccess(knex, orderid, txnid)
      .then((transaction) => {
        const { user } = transaction
        return userService.savePaymentInfo(knex, user, subscriptionid, cardno)
        .then(() => {
          return subscriptionService.startSubscription(knex, transaction)
        }).then(() => {
          return emailSupportReceipt(knex, transaction.id)
        })
      }).then(() => {
        return res.json({ success: true })
      })

    // The payment is __not__ valid
    } else {
      return service.paymentFailed(knex, orderid).then((support) => {
        return res.json({ success: false })
      })
    }
  }).catch(next)
}

export function cronRefreshSubscriptions (req, res, next) {
  const { knex } = req.app.locals

  // We should not wait with responding until we're finished, as refreshing
  // all expiring subscriptions potentially could take a loooong time as we need
  // a response from epay every time we refresh a subscription
  subscriptionService.refreshExpiringSubscriptions(knex)
  return res.json({ success: true })
}
