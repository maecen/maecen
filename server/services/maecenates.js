import { knex } from '../database'

const Maecenates = knex('maecenates')

export function userHasContentAccess (maecenateId, userId) {
  return userIsAdmin()
}

export function userIsAdmin (maecenateId, userId) {
  return Maecenates.where({ id: maecenateId, creator: userId })
  .count('1')
  .then(res => {
    console.log(res)
  })
}
