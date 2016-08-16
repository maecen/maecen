
// Database Calls
// ==============

export function savePaymentInfo (
  knex, userId, epaySubscriptionId, cardNumber
) {
  return knex('users')
  .where({ id: userId })
  .update({
    epay_subscription_id: epaySubscriptionId,
    payment_card: cardNumber
  })
}

export function fetchPaymentInfo (knex, userId) {
  return knex('users')
  .select('epay_subscription_id', 'payment_card')
  .where({ id: userId })
  .then(res => res[0])
}
