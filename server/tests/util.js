import Maecenate from '../models/Maecenate'
import User from '../models/User'

export const userId = '7965a310-20f1-11e6-b599-5b176d8b99fd'

export const base = {
  'Authorization': 'Token ' + User.createToken(userId)
}

export const customBase = (userId) => ({
  'Authorization': 'Token ' + User.createToken(userId)
})

export function createDummyMaecenate (creator, title) {
  let maecenate = new Maecenate({
    title: title || 'dummy maecenate',
    creator: creator || userId
  })
  maecenate.generateId()
  return maecenate.save(null, { method: 'insert', force: true })
}

