/**
 * Subscriptions are the current status of the users
 * subscription, including * what they're going to pay next time it is
 * paid again.
 * Every time a subscription is paid, a `sub_period` is created
 * with a range, from when it starts and when it ends. The period
 * indicates that a user currently supports the `maecenate` within the given
 * period.
 **/
import uuid from 'node-uuid'
import moment from 'moment'

// Database Calls
// ==============
function fetchActiveSubPeriods (knex, date) {
  return knex('subscriptions')
    .select(
      'sub_periods.id as id',
      'subscriptions.maecenate',
      'subscriptions.user',
      'transactions.amount',
      'transactions.currency',
      'start',
      'end',
      'transactions.created_at'
    )
    .innerJoin('sub_periods', 'subscription', 'subscriptions.id')
    .innerJoin('transactions', 'transaction', 'transactions.id')
    .where('start', '<=', date)
    .where('end', '>', date)
}

export function fetchSubscription (knex, subscriptionId) {
  return knex('subscriptions')
    .where({ subscription: subscriptionId })
    .limit(1)
    .then(result => result[0])
}

export function fetchActiveUserSubPeriods (knex, userId, date) {
  date = date || new Date()

  return fetchActiveSubPeriods(knex, date)
    .where('subscriptions.user', userId)
}

export function fetchActiveSubPeriodsForMaecenate (knex, maecenateId, date) {
  date = date || new Date()

  return fetchActiveSubPeriods(knex, date)
    .where('subscriptions.maecenate', maecenateId)
}

export function fetchActiveUserSubPeriodForMaecenate (
  knex, userId, maecenateId
) {
  return getActiveUserSubPeriodForMaecenate(knex, userId, maecenateId)
    .then(result => result[0])
}

export function createSubscription (
  knex, transaction,
) {
  const { user, maecenate, amount, currency } = transaction
  const subscription = {
    user,
    maecenate,
    amount,
    currency
  }

  // Don't recreate the subscription if it already exists just update it
  // with the amount and currency
  return knex('subscriptions')
  .select('id')
  .where({ user, maecenate })
  .limit(1)
  .then((res) => res[0])
  .then((sub) => {
    if (sub) {
      return knex('subscriptions')
      .where({ id: sub.id })
      .update(subscription)
      .then(() => sub.id)
    } else {
      const id = uuid.v1()
      return knex('subscriptions')
      .insert({ ...subscription, id })
      .then(() => id)
    }
  }).then((subscriptionId) => {
    return createSubPeriod(knex, subscriptionId, transaction)
  })
}

export function createSubPeriod (knex, subscriptionId, transaction) {
  const start = new Date(transaction.created_at)
  const end = moment(start).add(1, 'months').toDate()
  const { user, maecenate } = transaction

  const period = {
    id: uuid.v1(),
    subscription: subscriptionId,
    transaction: transaction.id,
    start,
    end
  }

  return knex('sub_periods').insert(period).then(() => ({
    ...period,
    user,
    maecenate
  }))
}

// Helper methods
// ==============
export function getActiveUserSubPeriodForMaecenate (
  knex, userId, maecenateId
) {
  return fetchActiveUserSubPeriods(knex, userId, new Date())
    .where('subscriptions.maecenate', maecenateId)
    .limit(1)
}

