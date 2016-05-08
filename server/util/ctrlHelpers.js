import mapValues from 'lodash/mapValues'
import mapKeys from 'lodash/mapKeys'
import map from 'lodash/map'

export function formatMongooseError (error) {
  return mapValues(error.errors, err => err.message)
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
      if (Array.isArray(entities) === true) {
        return mapKeys(entities, entity => entity._id)
      } else {
        const entity = entities
        return { [entity._id]: entity }
      }
    })
  }

  response.result = map(response.entities[responseObject], entity => entity._id)

  return response
}
