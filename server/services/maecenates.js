import { knex } from '../database'

export function userHasContentAccess (maecenateId, userId) {
  return userIsAdmin()
}

export function userIsAdmin (maecenateId, userId) {
  return knex('maecenates').where({ id: maecenateId, creator: userId })
  .count('1')
  .then(res => {
    console.log(res)
  })
}
