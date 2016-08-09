import { apiURL } from '../../shared/config'
import * as service from '../services/transactions'
import * as subscriptionService from '../services/subscriptions'

export function maecenateInitiatePayment (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { amount, maecenateId } = req.body

  service.createPayment(
    knex, service.SUPPORT_MAECENATE, userId, maecenateId, amount
  ).then(transaction => {
    const epayPaymentParams = {
      merchantnumber: process.env.EPAY_MERCANT_NUMBER,
      amount: String(amount),
      currency: 'DKK',
      windowid: String(process.env.EPAY_WINDOW_ID),
      group: 'Maecen',
      orderid: transaction.order_id,
      paymentcollection: '1',
      lockpaymentcollection: '1',
      instantcallback: '1',
      callbackurl: `${apiURL}/transactions/payment-callback`
    }

    return res.json(
      epayPaymentParams
    )
  })
}

export function paymentCallback (req, res, next) {
  const { knex } = req.app.locals
  const {
    txnid,
    orderid
  } = req.query

  const amount = Number(req.query.amount)

  knex.transaction(trx => {
    return service.verifyPayment(trx, orderid, amount).then(() => {
      return service.paymentSuccess(trx, orderid, txnid)
    }).then((transaction) => {
      return subscriptionService.createSubscription(trx, transaction)
    }).then((support) => {
      return res.json({ success: true })
    })
  }).catch(next)
}
