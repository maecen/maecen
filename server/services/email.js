
export const fetchMaecenateDeactivatedData = (knex, maecenateId) => {
  const date = new Date()

  const maecenateQuery = knex('maecenates').where({ id: maecenateId })

  const subscriptionsQuery = knex
  .select(
    'users.email',
    'users.first_name',
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
