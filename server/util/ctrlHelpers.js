import Joi from 'joi'
import mapValues from 'lodash/mapValues'
import mapKeys from 'lodash/mapKeys'
import { toCamelCase } from 'strman'
import map from 'lodash/map'

export function formatResponseError (error) {
  if (typeof error === 'string') {
    return { _: error }
  } else if (error instanceof Error) {
    if (error.errors) {
      return mapValues(error.errors,
        err => err.message ? err.message : err)
    } else {
      return { _: error.message }
    }
  } else {
    return error
  }
}

export function createError (obj) {
  let error = new Error()
  error.errors = {}
  for (let key in obj) {
    error.errors[key] = obj[key]
  }
  return error
}

export function normalizeResponse (data, responseObject) {
  if (!responseObject) {
    if (Object.keys(data).length === 1) {
      responseObject = Object.keys(data)[0]
    } else {
      throw new Error(`You need to set a \`responseObject\` to normalize the
        response`)
    }
  }

  let response = {
    entities: mapValues(data, entities => {
      if (entities && typeof entities.toJSON === 'function') {
        entities = entities.toJSON()
      }

      if (Array.isArray(entities) === true) {
        return mapKeys(entities, entity => entity.id)
      } else if (entities === null) {
        return {}
      } else {
        const entity = entities
        return { [entity.id]: entity }
      }
    })
  }

  response.result = map(response.entities[responseObject], entity => entity.id)

  return response
}

export function joiValidation (obj, schema) {
  return new Promise((resolve, reject) => {
    const options = {
      abortEarly: false
    }

    Joi.validate(obj, schema, options, (err, val) => {
      if (err === null) {
        return resolve()
      }

      let errors = err.details.map(error => {
        if (error.type === 'object.missing') {
          return {
            message: 'validationError.objectMissing',
            options: {
              key: '_',
              context: toCamelCase(error.context.peers.join(' '))
            }
          }
        } else {
          return {
            message: 'validationError.' + toCamelCase(error.type.replace(/\./g, ' ')),
            options: {
              ...error.context,
              context: error.path
            }
          }
        }
      })

      reject(mapKeys(errors, err => err.options.key))
    })
  })
}
