import { normalizeResponse } from '../util/ctrlHelpers'
import * as service from '../services/subscriptions'

export const cancelSubscription = (req, res, next) => {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { id } = req.params
  return service.stopSubscription(knex, userId, id)
  .then((success) => {
    return service.fetchActiveUserSubPeriodForMaecenate(knex, userId, id)
    .then((result) => {
      return res.json({
        ...normalizeResponse({ supports: result }),
        success: true
      })
    })
  }).catch(next)
}

export const updateSubscription = (req, res, next) => {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { id } = req.params
  const amount = Number(req.body.amount)

  return knex('maecenates')
  .where({ id, active: true })
  .then(([maecenate]) => {
    console.log(amount, maecenate.monthly_minimum)
    if (maecenate.monthly_minimum * 100 > amount) {
      const error = { 'amount': 'validationError.numberMin' }
      throw error
    }

    return service.updateSubscription(knex, userId, id, amount)
    .then((success) => {
      return service.fetchActiveUserSubPeriodForMaecenate(knex, userId, id)
      .then((result) => {
        return res.json({
          ...normalizeResponse({ supports: result }),
          success: true
        })
      })
    })
  }).catch(next)
}
