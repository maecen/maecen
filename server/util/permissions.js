import Maecenate from '../models/Maecenate'
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
  const { userId } = req.user
  const { slug } = req.params
  return Maecenate.isUserAdminBySlug(slug, userId).then(result => {
    if (result === true) {
      next()
    } else {
      const errors = { user: 'error.notOwnerOfMaecenate' }
      res.status(401).json({ errors })
    }
  }).catch(next)
}
