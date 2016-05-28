import app from '../../index'
import { knex } from '../database'
import request from 'supertest-as-promised'
import test from 'ava'
import Maecenate from '../models/maecenate'
import User from '../models/user'
import Post from '../models/post'

const userId = '7965a310-20f1-11e6-b599-5b176d8b99fd'
const base = {
  'Authorization': 'Token ' + User.createToken(userId)
}

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

function createDummyMaecenate (creator) {
  let maecenate = new Maecenate({
    title: 'dummy maecenate',
    creator: creator || userId
  })
  maecenate.generateId()
  return maecenate.save(null, { method: 'insert', force: true })
}

function createDummyPost (nr, maecenate) {
  let post = new Post({
    title: 'Some title' + nr,
    content: 'some content' + nr,
    maecenate: maecenate,
    author: userId
  })
  post.generateId()
  return post.save(null, { method: 'insert' })
}

test('POST /api/createPost', async t => {
  const maecenate = await createDummyMaecenate()

  const data = {
    title: 'Some title',
    content: 'Some content for the article which is a bit longer than the title',
    maecenate: maecenate.id
  }

  const res = await request(app)
    .post('/api/createPost')
    .set(base)
    .send({ post: data })

  t.falsy(res.body.errors)
  t.is(res.status, 200)
  const entityId = res.body.result[0]
  t.is(res.body.entities.posts[entityId].title, data.title)
})

test('POST /api/createPost for non owners', async t => {
  const maecenate = await createDummyMaecenate('userid')

  const data = {
    title: 'Some title',
    content: 'Some content for the article which is a bit longer than the title',
    maecenate: maecenate.id
  }

  const res = await request(app)
    .post('/api/createPost')
    .set(base)
    .send({ post: data })

  t.truthy(res.body.errors)
  t.is(res.status, 401)
})

test('GET /api/getMaecenatePosts', async t => {
  const maecenate = await createDummyMaecenate()

  await createDummyPost(1, maecenate.id)
  await createDummyPost(2, maecenate.id)

  const res = await request(app)
    .get(`/api/getMaecenatePosts/${maecenate.get('slug')}`)
    .expect(200)

  t.is(res.body.result.length, 2)
})

