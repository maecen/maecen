import { apiURL } from '../../shared/config'
import * as service from '../services/transactions'
import * as maecenateService from '../services/maecenates'

export function maecenateInitiatePayment (req, res, next) {
  const { userId } = req.user
  const { amount, maecenateId } = req.body

  service.createPayment(
    service.SUPPORT_MAECENATE, userId, maecenateId, amount
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
  const {
    txnid,
    orderid
  } = req.query

  const amount = Number(req.query.amount)

  return service.verifyPayment(orderid, amount).then(() => {
    return service.paymentSuccess(orderid, txnid)
  }).then((transaction) => {
    const { maecenate, user } = transaction
    return maecenateService.supportMaecenate(maecenate, user, amount)
  }).then(() => {
    return res.json({ success: true })
  }).catch(next)
}
