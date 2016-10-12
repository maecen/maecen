import { toCamelCase } from 'strman'
import { fetchSupporters } from './maecenates'

export const fetchMaecenateDeactivatedData = (knex, maecenateId) => {
  const date = new Date()

  const maecenateQuery = knex('maecenates').where({ id: maecenateId })

  const subscriptionsQuery = knex
  .select(
    'users.email',
    'users.first_name',
    'users.language',
    'sub_query.end',
    'sub_query.subscription'
  )
  .from(function () {
    // Select the latest end date from all current sub_periods
    this.select('subscription').max('end as end')
    .from('sub_periods')
    .where('sub_periods.end', '>', date)
    .groupBy('subscription')
    .as('sub_query')
  })
  .innerJoin('subscriptions', 'sub_query.subscription', 'subscriptions.id')
  .innerJoin('users', 'subscriptions.user', 'users.id')
  .where('subscriptions.maecenate', maecenateId)
  .where('subscriptions.renew', true)

  return Promise.all([
    maecenateQuery,
    subscriptionsQuery
  ])
  .then(([[maecenate], users]) => ({maecenate, users}))
}

export const fetchToMaecenateData = (knex, maecenateId) =>
  Promise.all([
    fetchSupporters(knex, maecenateId)
    .then(userIds =>
      knex('users')
      .select(
        'email',
        'first_name',
        'last_name',
        'language'
      )
      .whereIn('id', userIds)
    ),
    knex('maecenates')
    .select('title', 'slug')
    .where({ id: maecenateId })
  ]).then(([users, [maecenate]]) => ({ users, maecenate }))

export const fetchNewSupporterData = (knex, subscriptionId) =>
  knex('subscriptions')
    .select(selectFields('maecenates', 'maecenate', ['title', 'slug']))
    .select(selectFields('supporter', ['first_name', 'last_name', 'email']))
    .select(selectFields('admin', ['first_name', 'email', 'language']))
    .select(selectFields('subscriptions', 'subscription', ['amount', 'currency']))
    .innerJoin('maecenates', 'subscriptions.maecenate', 'maecenates.id')
    .innerJoin('users as supporter', 'supporter.id', 'subscriptions.user')
    .innerJoin('users as admin', 'admin.id', 'maecenates.creator')
    .where('subscriptions.id', subscriptionId)
    .then(data => parseSelectedResponse(data[0]))

const parseSelectedResponse = (data) => {
  let obj = {}
  for (let key in data) {
    const keys = key.split('.')
    if (keys[0] in obj === false) obj[keys[0]] = {}
    obj[keys[0]][keys[1]] = data[key]
  }
  return obj
}

const selectFields = (from, to, fields) => {
  if (typeof fields === 'undefined') {
    fields = to
    to = from
  }
  return fields.map(field => `${from}.${field} as ${to}.${toCamelCase(field)}`)
}
