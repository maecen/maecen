import { formatResponseError } from '../util/ctrlHelpers'
import mapValues from 'lodash/mapValues'

export function catchError (err, req, res, next) {
  if (err.stack) {
    console.log(err.stack)
  }

  if (err._responseStatus === 404) {
    console.log('response status')
    res.status(404).send('No Page Found')
    return
  }

  let errors = formatResponseError(err)

  errors = mapValues(errors, (error, key) => {
    console.log('[CAUGHT ERROR]', key, error)
    if (error && error.message) {
      return localizeMessage(req.t, error.message, error.options)
    } else {
      return localizeMessage(req.t, error, { context: key })
    }
  })

  res.status(500).json({ errors })
}

function localizeMessage (t, message, options) {
  // Check if it's a token and not a normal text
  if (typeof message === 'string' && message.includes(' ') === false &&
    message.includes('.') === true) {
    return t(message, options)
  }

  return message
}
