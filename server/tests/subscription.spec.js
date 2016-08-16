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
    id: uuid.v1(),
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

test('Support maecenates', async t => {
  const otherMaecenate = t.context.otherMaecenate
  const otherUser = t.context.otherUser
  const amount = 1000
  const res = await request(app)
    .post('/api/maecenates/initiate-payment')
    .set(base)
    .send({ maecenateId: otherMaecenate.id, amount })

  t.is(res.status, 200)
  t.truthy(res.body.epayPaymentParams.orderid)
  t.is(res.body.epayPaymentParams.amount, String(amount))
  const orderId = res.body.epayPaymentParams.orderid

  const txnid = '123456789'
  const cbRes = await request(app)
    .get(`/api/transactions/payment-callback?txnid=${txnid}&orderid=${orderId}` +
         `&amount=${amount}&subscriptionid=1234567&cardno=444444XXXXXX4000`)

  t.is(cbRes.status, 200)
  t.is(cbRes.body.success, true)

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

  const resMaecenate = await request(app)
    .get(`/api/getMaecenate/${otherMaecenate.get('slug')}`)
    .set(base)
    .send()

  t.is(resMaecenate.status, 200)
  const { result: mcResult, entities: mcEntities } = resMaecenate.body
  t.is(mcResult.length, 1)
  t.is(Object.keys(mcEntities.maecenates).length, 1)
  t.is(Object.keys(mcEntities.supports).length, 1)

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

