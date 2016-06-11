import test from 'ava'
import request from 'supertest-as-promised'
import uuid from 'node-uuid'
import app from '../../index'
import { knex } from '../database'
import { base, userId, createDummyMaecenate } from './util'
import User from '../models/User'

test.beforeEach(t =>
  knex.migrate.latest().then(() => {
    let user = new User({
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      password: 'password'
    })
    return user.save(null, { method: 'insert' })
  })
)
test.afterEach.always(t => knex.migrate.rollback())

test('POST /api/supportMaecenate', async t => {
  const maecenate = await createDummyMaecenate(uuid.v4())
  const res = await request(app)
    .post('/api/supportMaecenate')
    .set(base)
    .send({ maecenateId: maecenate.id, amount: 10 })

  t.is(res.status, 200)

  const entityId = res.body.result[0]
  t.is(res.body.entities.supports[entityId].amount, 10)

  // Check if we can watch the newly supported maecenates again
  const res2 = await request(app)
    .get('/api/getSupportedMaecenates/' + userId)
    .set(base)
    .send()

  t.is(res2.status, 200)
  const { result, entities } = res2.body
  t.is(result.length, 1)
  t.is(Object.keys(entities.maecenates).length, 1)
  t.is(Object.keys(entities.supports).length, 1)
})
