import { formatResponseError } from './ctrlHelpers'

export function verifyAuth (req, res, next) {
  if (req.user) {
    return next()
  } else {
    let errors = formatResponseError('You don\'t have permissions')
    return res.status(401).json({ errors })
  }
}
