import app from '../../index'
import { knex } from '../database'
import request from 'supertest-as-promised'
import test from 'ava'

test.beforeEach(t => knex.migrate.latest())
test.afterEach.always(t => knex.migrate.rollback())

test('POST /api/users/create', async t => {
  const data = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'JOHNdoe@gmail.com',
    password: 'somepasswordforjohndoe',
    language: 'en'
  }

  const res = await request(app)
    .post('/api/users/create')
    .send({ user: data })

  t.is(res.status, 200)
  const entityId = res.body.result[0]
  // We here test that the email is transformed to lower case as well as testing
  // if the the user is correctly returned
  t.is(res.body.entities.users[entityId].email, data.email.toLowerCase())
})

/*
test('POST /api/authUser', t => {

})

test('POST /api/clearAuth', t => {

})

test('POST /api/updateAuthUser', t => {

})

test('GET /api/getAuthUser', t => {

})

test('PUT /api/setUserLanguage', t => {

})
*/
