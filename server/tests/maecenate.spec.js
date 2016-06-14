import test from 'ava'
import request from 'supertest-as-promised'
import uuid from 'node-uuid'
import app from '../../index'
import { knex } from '../database'
import { base, userId } from './util'
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

  await authUser.save(null, { method: 'insert' })
  t.context.authUser = authUser
})
test.afterEach.always(t => knex.migrate.rollback())

test('POST /api/createMaecenate', async t => {
  const logoId = uuid.v1()
  await knex('media').insert({
    id: logoId, type: 'image/jpg', url: 'https://fakeurl.com' })

  const coverId = uuid.v1()
  await knex('media').insert({
    id: coverId, type: 'image/jpg', url: 'https://fakeurl.com' })

  const maecenateData = {
    title: 'Some Maecenate',
    creator: t.context.authUser.id,
    logo_media: logoId,
    cover_media: coverId,
    teaser: 'Quisque laoreet magna amet.',
    description: 'Cras luctus velit non dignissim magna amet.',
    monthly_minimum: 20
  }

  const res = await request(app)
    .post('/api/createMaecenate')
    .set(base)
    .send({ maecenate: maecenateData })

  t.is(res.status, 200)
  const { result, entities } = res.body
  t.is(result.length, 1)
  t.is(Object.keys(entities.maecenates).length, 1)
  t.is(Object.keys(entities.media).length, 2)
})
