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
import transactionService from './transactions'

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
      'sub_periods.start',
      'sub_periods.end',
      // We use the transactions created_at as it should be valid from when
      // the transaction has been created
      'transactions.created_at'
    )
    .innerJoin('sub_periods', 'subscription', 'subscriptions.id')
    .innerJoin('transactions', 'transaction', 'transactions.id')
    .where('sub_periods.start', '<=', date)
    .where('sub_periods.end', '>', date)
}

export function fetchSubscription (knex, subscriptionId) {
  return knex('subscriptions')
    .where({ id: subscriptionId })
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

export function startSubscription (knex, transaction) {
  const { user, maecenate, amount, currency } = transaction
  const subscription = {
    user,
    maecenate,
    amount,
    currency,
    started_at: new Date(transaction.created_at)
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
    return createSubPeriod(
      knex, subscriptionId, transaction, transaction.created_at, 1
    )
  })
}

export function createSubPeriod (
  knex, subscriptionId, transaction, start, durationMonths
) {
  return fetchSubscription(knex, subscriptionId).then((subscription) => {
    start = new Date(start)
    const end = getNextEndDate(start, subscription.started_at, 1)
    console.log('next end date', end)
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
  })
}

// Helper methods
// ==============
function getNextEndDate (nextStart, startedAt, durationMonths) {
  startedAt = moment(startedAt)
  nextStart = moment(nextStart)
  // Round to nearest month, as the months between jan 31th and feb 28th isn't a
  // complete month in days which will result in a lower than whole number, but
  // it should be treated as a whole month
  const monthsSinceStartedAt = Math.round(
    nextStart.diff(startedAt, 'months', true)
  )
  const deltaMonths = monthsSinceStartedAt + durationMonths
  const nextEnd = startedAt.clone().add(deltaMonths, 'months').toDate()
  return nextEnd
}

export function getActiveUserSubPeriodForMaecenate (
  knex, userId, maecenateId
) {
  return fetchActiveUserSubPeriods(knex, userId, new Date())
    .where('subscriptions.maecenate', maecenateId)
    .limit(1)
}

