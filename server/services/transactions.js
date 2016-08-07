import uuid from 'node-uuid'
import { knex } from '../database'

// Constants
// =========
export const SUPPORT_MAECENATE = {
  id: 'SUPPORT_MAECENATE',
  shortId: 'S'
}

// Database Calls
// ==============
export function fetchTransactionById (id) {
  return knex('transactions').where({ id }).limit(1)
    .then((result) => result[0])
}

export function fetchTransactionByOrder (orderId) {
  return knex('transactions').where({ order_id: orderId }).limit(1)
    .then((result) => result[0])
}

export function createPayment (
  type, userId, maecenateId, amount, status
) {
  status = status || 'started'

  const transaction = {
    id: uuid.v1(),
    order_id: type.shortId + generateUnique(8),
    epay_id: 0,
    type: type.id,
    amount: amount,
    currency: 'DKK',
    user: userId,
    maecenate: maecenateId,
    status: 'started'
  }

  return knex('transactions').insert(transaction).then(() => {
    return transaction
  })
}

export function verifyPayment (orderId, amount) {
  return fetchTransactionByOrder(orderId).then((transaction) => {
    if (transaction.amount !== amount) {
      const error = { amount: 'wrongAmount' }
      throw error
    }
    return true
  })
}

export function paymentSuccess (orderId, epayId) {
  return knex('transactions').where({ order_id: orderId }).limit(1).update({
    status: 'success'
  }).then(() => {
    return knex('transactions').where({ order_id: orderId }).limit(1)
  }).then(result => result[0])
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
