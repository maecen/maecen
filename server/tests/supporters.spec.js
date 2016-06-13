import test from 'ava'
import request from 'supertest-as-promised'
import uuid from 'node-uuid'
import app from '../../index'
import { knex } from '../database'
import { customBase, base, userId, createDummyMaecenate } from './util'
import User from '../models/User'

test.beforeEach(async t => {
  await knex.migrate.latest()

  let authUser = new User({
    id: userId,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    password: 'password'
  })

  let otherUser = new User({
    id: uuid.v4(),
    first_name: 'Eva',
    last_name: 'Doe',
    email: 'eva@doe.com',
    password: 'password'
  })

  await authUser.save(null, { method: 'insert' })
  await otherUser.save(null, { method: 'insert' })

  t.context.maecenate = await createDummyMaecenate(authUser.id)
  t.context.otherMaecenate = await createDummyMaecenate(otherUser.id, 'other')
  t.context.authUser = authUser
  t.context.otherUser = otherUser
})
test.afterEach.always(t => knex.migrate.rollback())

test('POST /api/supportMaecenate', async t => {
  const otherMaecenate = t.context.otherMaecenate
  const otherUser = t.context.otherUser
  const res = await request(app)
    .post('/api/supportMaecenate')
    .set(base)
    .send({ maecenateId: otherMaecenate.id, amount: 10 })

  t.is(res.status, 200)

  const entityId = res.body.result[0]
  t.is(res.body.entities.supports[entityId].amount, 10)

  // Check if we can watch the newly supported maecenates again
  const resSupported = await request(app)
    .get('/api/getSupportedMaecenates/' + userId)
    .set(base)
    .send()

  t.is(resSupported.status, 200)
  const { result, entities } = resSupported.body
  t.is(result.length, 1)
  t.is(Object.keys(entities.maecenates).length, 1)
  t.is(Object.keys(entities.supports).length, 1)

  console.log('slug', otherMaecenate.get('slug'))
  const resMaecens = await request(app)
    .get('/api/getMaecenateSupporters/' + otherMaecenate.get('slug'))
    .set(customBase(otherUser.id))
    .send()

  t.is(resMaecens.status, 200)
  const { result: resultM, entities: entitiesM } = resMaecens.body
  t.is(resultM.length, 1)
  t.is(Object.keys(entitiesM.users).length, 1)
  t.is(Object.keys(entitiesM.supports).length, 1)
})

