import uuid from 'node-uuid'
import moment from 'moment'

// Database Calls
// ==============
export function fetchUser (knex, id) {
  return knex('users').where({ id })
  .then(results => results[0])
}

export function savePaymentInfo (
  knex, userId, epaySubscriptionId, cardNumber
) {
  // Get and replace all but the last four characters with * and then
  // get the last four characters
  const cardStart = cardNumber.substr(0,
    cardNumber.length - 4).replace(/(.)/g, '*')
  const cardEnd = cardNumber.slice(-4)

  return knex('users')
  .where({ id: userId })
  .update({
    epay_subscription_id: epaySubscriptionId,
    payment_card: cardStart + cardEnd
  })
}

export function fetchPaymentInfo (knex, userId) {
  return knex('users')
  .select('epay_subscription_id', 'payment_card')
  .where({ id: userId })
  .then(res => res[0])
}

export function saveUserLangueage (knex, userId, language) {
  return knex('users')
  .where({ id: userId })
  .update({
    language: language
  })
}

export function createAccessToken (knex, email) {
  return knex('users')
  .select('id')
  .where({ email })
  .then(res => res[0])
  .then((user) => {
    if (!user) {
      const error = { email: 'error.noUserWithEmail' }
      throw error
    }

    const token = uuid.v1()
    return knex('access_tokens').insert({
      token,
      user: user.id,
      expires_at: moment().add(1, 'hours').toDate()
    }).then(() => ({
      userId: user.id,
      token
    }))
  })
}

export function fetchUserByValidAccessToken (knex, token) {
  const now = new Date()
  const tokenQuery = knex('access_tokens')
  .where({ token })
  .andWhere('expires_at', '>', now)
  .limit(1)
  .select('user')

  return knex('users').where('id', '=', tokenQuery)
  .then(res => {
    if (!res[0]) {
      const error = { _: 'accessToken.doesNotExist' }
      throw error
    }
    return res[0]
  })
}

export function expireAccessToken (knex, token) {
  const now = new Date()
  return knex('access_tokens')
  .where({ token })
  .andWhere('expires_at', '>', now)
  .update({ expires_at: now })
  .limit(1)
}
