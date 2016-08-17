import test from 'ava'
import fs from 'fs'
import request from 'supertest-as-promised'
import uuid from 'node-uuid'
import moment from 'moment'
import nock from 'nock'
import app from '../../index'
import { knex } from '../database'
import { customBase, base, userId, createDummyMaecenate } from './util'
import User from '../models/User'

import * as subscriptionService from '../services/subscriptions'
import * as transactionService from '../services/transactions'

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

test('GET cronRefreshSubscriptions', async t => {
  const otherMaecenate = t.context.otherMaecenate
  const authUser = t.context.authUser
  const amount = 4000
  const today = moment(new Date()).set({
    millisecond: 0, second: 0, minute: 0, hour: 0
  })
  const tomorrow = today.clone().add(1, 'days')

  const transaction = {
    id: uuid.v1(),
    type: transactionService.SUPPORT_MAECENATE.id,
    user: authUser.id,
    maecenate: otherMaecenate.id,
    amount,
    currency: 'DKK',
    status: 'success',
    order_id: 'S1234567'
  }
  await knex('transactions').insert(transaction)

  const subscription = {
    id: uuid.v1(),
    maecenate: otherMaecenate.id,
    user: authUser.id,
    amount,
    currency: 'DKK',
    started_at: today.clone().subtract(1, 'months').toDate()
  }
  await knex('subscriptions').insert(subscription)

  await knex('sub_periods').insert({
    id: uuid.v1(),
    subscription: subscription.id,
    transaction: transaction.id,
    start: subscription.started_at,
    end: tomorrow.toDate()
  })

  const epaySoapOpenXML = fs.readFileSync('./util/epaySoapOpen.xml')
  nock('https://ssl.ditonlinebetalingssystem.dk')
    .get('/remote/subscription.asmx?WSDL')
    .reply(200, epaySoapOpenXML, {
      'content-type': 'text/xml; charset=utf-8'
    })

  nock('https://ssl.ditonlinebetalingssystem.dk')
    .post('/remote/subscription.asmx')
    .reply(200, '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:s' +
      'oap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.' +
      'w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLS' +
      'chema"><soap:Body><authorizeResponse xmlns="https://ssl.ditonlinebetal' +
      'ingssystem.dk/remote/subscription"><authorizeResult>true</authorizeRes' +
      'ult><fraud>0</fraud><transactionid>78006078</transactionid><pbsrespons' +
      'e>0</pbsresponse><epayresponse>-1</epayresponse></authorizeResponse></' +
      'soap:Body></soap:Envelope>',
      { 'content-type': 'text/xml; charset=utf-8' })

  await subscriptionService.refreshExpiringSubscriptions(knex)
  const subPeriods = await knex('sub_periods')
  t.is(subPeriods.length, 2)

  // As we're trying to refresh a subscription which already is refreshed this
  // will throw an error
  await t.throws(subscriptionService.refreshExpiringSubscriptions(knex))
})
