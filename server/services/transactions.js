import uuid from 'node-uuid'
import soap from 'soap'
import request from 'request'

const requestWithProxy = request.defaults({
  proxy: `${process.env.PROXIMO_URL}:80`,
  timeout: 5000,
  connection: 'keep-alive'
})
const soapClientOptions = {
  request: requestWithProxy
}

export const epaySoapUrl = 'https://ssl.ditonlinebetalingssystem.dk/remote/subscription.asmx?WSDL'

// Constants
// =========
export const SUPPORT_MAECENATE = {
  id: 'SUPPORT_MAECENATE',
  shortId: 'S'
}

export const REFRESH_MAECENATE = {
  id: 'REFRESH_MAECENATE',
  shortId: 'R'
}

// Database Calls
// ==============
export function fetchTransactionByOrder (knex, orderId) {
  return knex('transactions').where({ order_id: orderId }).limit(1)
    .then((result) => result[0])
}

export function createPayment (knex, {
  paymentType,
  userId,
  maecenateId,
  amount,
  currency,
  status
}) {
  status = status || 'started'

  const transaction = {
    id: uuid.v1(),
    order_id: paymentType.shortId + generateUnique(7),
    epay_id: 0,
    type: paymentType.id,
    amount: amount,
    currency,
    user: userId,
    maecenate: maecenateId,
    status: 'started'
  }

  return knex('transactions').insert(transaction).then(() => {
    return {
      merchantnumber: process.env.EPAY_MERCANT_NUMBER,
      amount: String(amount),
      currency,
      group: 'Maecen',
      orderid: transaction.order_id
    }
  })
}

export function verifyPayment (knex, orderId, amount) {
  return fetchTransactionByOrder(knex, orderId).then((transaction) => {
    return {
      valid: transaction && transaction.amount === amount,
      verified: ['success', 'error'].indexOf(transaction.status) !== -1
    }
  })
}

export function paymentSuccess (knex, orderId, epayId) {
  return knex('transactions').where({ order_id: orderId }).limit(1).update({
    status: 'success',
    epay_id: Number(epayId)
  }).then(() => {
    return knex('transactions').where({ order_id: orderId }).limit(1)
  }).then(result => result[0])
}

export function paymentFailed (knex, orderId) {
  return knex('transactions').where({ order_id: orderId }).limit(1).update({
    status: 'error'
  })
}

export function authorizePayment (knex, {
  paymentType,
  userId,
  epaySubscriptionId,
  maecenateId,
  amount,
  currency
}) {
  return createPayment(knex, {
    paymentType,
    userId,
    maecenateId,
    amount,
    currency
  }).then(epayOptions => {
    const epayPaymentParams = {
      ...epayOptions,
      subscriptionid: epaySubscriptionId,
      instantcapture: '1',
      currency: epayCurrencyToShittyNumber(epayOptions.currency),
      pwd: process.env.EPAY_PASSWORD
    }

    return new Promise((resolve, reject) => {
      soap.createClient(epaySoapUrl, soapClientOptions, (err, client) => {
        if (err) {
          return reject(err)
        } else {
          client.authorize(epayPaymentParams, (err, result, raw) => {
            if (err) {
              return reject(err)
            }
            const { authorizeResult, transactionid } = result

            if (authorizeResult === false) {
              const error = { _: 'payment.authorizePaymentFailed', result }
              return reject(error)
            }
            return resolve({ success: true, transactionid })
          })
        }
      })
    }).catch((err) => {
      console.log('[ERROR in authorizePayment]', err)
      return { success: false }
    }).then(({ success, transactionid }) => {
      if (success) {
        return paymentSuccess(knex, epayOptions.orderid, transactionid)
      } else {
        return paymentFailed(knex, epayOptions.orderid)
        .then(() => false)
      }
    })
  })
}

export function fetchReceiptInfoFromTransaction (knex, transactionId) {
  return knex('transactions')
  .select(
    'users.first_name as firstName',
    'users.email',
    'users.language',
    'maecenates.title as maecenateTitle',
    'maecenates.slug as maecenateSlug',
    'sub_periods.end',
    'transactions.user',
    'transactions.amount',
    'transactions.currency',
    'transactions.order_id as orderId'
  )
  .innerJoin(
    'sub_periods', 'sub_periods.transaction', 'transactions.id'
  )
  .innerJoin(
    'maecenates', 'maecenates.id', 'transactions.maecenate'
  )
  .innerJoin(
    'users', 'users.id', 'transactions.user'
  )
  .where('transactions.id', transactionId)
  .then(res => res[0])
}

// Helper methods
// ==============
function generateUnique (length) {
  const charset =
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let out = ''
  for (let i = 0; i < length; i++) {
    out += charset[(Math.random() * charset.length) << 0]
  }
  return out
}

function epayCurrencyToShittyNumber (currencyCode) {
  const mappings = {
    'DKK': '208',
    'EUR': '978',
    'USD': '840'
  }
  return mappings[currencyCode]
}
