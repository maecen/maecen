import test from 'ava'
import { normalizeResponse } from '../util/ctrlHelpers'

const userA = { id: 'a', first_name: 'John', last_name: 'Doe' }
const userB = { id: 'b', first_name: 'Lise', last_name: 'Doe' }
const postA = { id: 'a', title: 'title for a' }
const postB = { id: 'b', title: 'title for b' }

test('normalizeResponse basic', t => {
  const resp = normalizeResponse({
    users: userA
  })

  t.deepEqual(resp, {
    result: ['a'],
    entities: {
      users: { 'a': userA }
    }
  })
})

test('normalizeResponse basic array', t => {
  const resp = normalizeResponse({
    users: [userA, userB]
  })

  t.deepEqual(resp, {
    result: ['a', 'b'],
    entities: {
      users: {
        'a': userA,
        'b': userB
      }
    }
  })
})

test('normalizeResponse gives a bug', t => {
  t.throws(() =>
    normalizeResponse({
      users: [userA, userB],
      posts: [postA, postB]
    })
  )
})

test('normalizeResponse multiple entities', t => {
  const resp = normalizeResponse({
    users: [userA, userB],
    posts: [postA, postB]
  }, 'users')

  t.deepEqual(resp, {
    result: ['a', 'b'],
    entities: {
      users: {
        a: userA,
        b: userB
      },
      posts: {
        a: postA,
        b: postB
      }
    }
  })
})
