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
  .then(([[maecenate], users]) => {
    return { maecenate, users }
  })
}

export const fetchToMaecenateData = (knex, maecenateId) => {
  return Promise.all([
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
}
