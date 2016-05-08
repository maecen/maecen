import mapValues from 'lodash/mapValues'
import Immutable from 'seamless-immutable'

export default function (state) {
  return mapValues(state, store => Immutable(store))
}
