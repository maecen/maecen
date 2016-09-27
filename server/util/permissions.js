import { userIsAdminBySlug } from '../services/maecenates'
import { formatResponseError } from './ctrlHelpers'

export function verifyAuth (req, res, next) {
  if (req.user) {
    return next()
  } else {
    let errors = formatResponseError('You don\'t have permissions')
    return res.status(401).json({ errors })
  }
}

export function verifyMaecenateAdmin (req, res, next) {
  const { knex } = req.app.locals
  const { userId } = req.user
  const { slug } = req.params

  return userIsAdminBySlug(knex, slug, userId)
  .then(result => {
    if (result !== false) {
      req.maecenateId = result
      next()
    } else {
      const errors = { _: 'error.notOwnerOfMaecenate' }
      res.status(401).json({ errors })
    }
  })
  .catch(next)
}
