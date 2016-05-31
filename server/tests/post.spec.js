import request from 'supertest-as-promised'
import uuid from 'node-uuid'
import test from 'ava'
import app from '../../index'
import { knex } from '../database'
import Maecenate from '../models/Maecenate'
import User from '../models/User'
import Post from '../models/Post'

const userId = '7965a310-20f1-11e6-b599-5b176d8b99fd'
const base = {
  'Authorization': 'Token ' + User.createToken(userId)
}
const postData = {
  title: 'Some title',
  author_alias: 'John'
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
    author_alias: 'John',
    author: userId,
    created_at: Date.now() + nr * 1000
  })
  post.generateId()
  return post.save(null, { method: 'insert', force: true })
}

test('POST /api/createPost', async t => {
  const maecenate = await createDummyMaecenate()

  const data = {
    ...postData,
    content: 'Some content for the article which',
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

test('POST /api/createPost with image', async t => {
  const maecenate = await createDummyMaecenate()

  const mediaId = uuid.v1()
  await knex('post_media').insert({
    id: mediaId,
    type: 'image/jpg',
    url: 'https://fakeurl.com'
  })

  const errData = {
    ...postData,
    maecenate: maecenate.id
  }

  const data = {
    ...errData,
    media: [mediaId]
  }

  const errRes = await request(app)
    .post('/api/createPost')
    .set(base)
    .send({ post: errData })

  t.truthy(errRes.body.errors)

  const res = await request(app)
    .post('/api/createPost')
    .set(base)
    .send({ post: data })

  t.falsy(res.body.errors)
  t.is(res.status, 200)
  const entityId = res.body.result[0]
  const post = res.body.entities.posts[entityId]
  t.is(post.title, data.title)

  t.is(post.media.length, 1)
  const mId = post.media
  t.is(res.body.entities.postMedia[mId].post, entityId)
})

test('POST /api/createPost for non owners', async t => {
  const maecenate = await createDummyMaecenate('userid')

  const data = {
    ...postData,
    content: 'Some content for the article which',
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

  const post1 = await createDummyPost(1, maecenate.id)
  const post2 = await createDummyPost(2, maecenate.id)

  const res = await request(app)
    .get(`/api/getMaecenatePosts/${maecenate.get('slug')}`)
    .expect(200)

  t.is(res.body.result.length, 2)
  // Make sure the order of the posts are returned descending by created_at
  t.deepEqual(res.body.result, [post2.id, post1.id])
})

