
exports.up = function (knex, Promise) {
  return knex('sub_periods').del()
  .then(() => knex('transactions').del())
  .then(() => knex('subscriptions').del())
  .then(() => knex('users').update({
    'epay_subscription_id': null,
    'payment_card': null
  }))
}

exports.down = function (knex, Promise) { }
