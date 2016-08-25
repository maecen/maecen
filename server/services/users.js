
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
