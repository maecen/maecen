import { browserHistory } from 'react-router'
import * as ActionTypes from '../constants/constants'
import * as sharedConfig from '../../shared/config'
import axios from 'axios'

const baseURL = (typeof window === 'undefined' ? sharedConfig.host : '') + '/api'

export function setAuthUser (id, entities) {
  return {
    type: ActionTypes.SET_AUTH_USER,
    id,
    entities
  }
}

export function authUser (credentials) {
  return (dispatch) => { }
}

function clearAuthUser () {
  return {
    type: ActionTypes.CLEAR_AUTH_USER
  }
}

export function clearAuth () {
  return (dispatch) => {
    axios.post(`${baseURL}/clearAuth`)
      .then(res => res.data)
      .then(data => {
        dispatch(clearAuthUser())
        browserHistory.push('/')
      })
  }
}

export function requireAuth (url) {
  url = url || null

  return {
    type: ActionTypes.REQUIRE_AUTHORIZATION,
    url
  }
}

export function cancelRequireAuth () {
  return {
    type: ActionTypes.CANCEL_REQUIRE_AUTHORIZATION
  }
}

export function updateEntities (entities) {
  return {
    type: ActionTypes.UPDATE_ENTITIES,
    entities
  }
}

export function createMaecenateSuccess (data) {
  return (dispatch) => {
    dispatch(updateEntities(data.entities))
  }
}

function setMaecenate (id) {
  return {
    type: ActionTypes.SET_MAECENATE,
    id
  }
}

function fetchMaecenateSuccess (data) {
  const id = data.result[0]

  return {
    type: ActionTypes.SET_MAECENATE,
    id,
    entities: data.entities
  }
}

export function fetchMaecenate (slug) {
  return (dispatch) => {
    dispatch(setMaecenate(null))
    return axios.get(`${baseURL}/getMaecenate/${slug}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

function fetchMaecenateListSuccess (data) {
  const ids = data.result

  return {
    type: ActionTypes.SET_MAECENATE_LIST,
    ids,
    entities: data.entities
  }
}

export function fetchMaecenateList () {
  return (dispatch) => {
    return axios.get(`${baseURL}/getMaecenates`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function fetchUserMaecenateList (userId) {
  return (dispatch) => {
    return axios.get(`${baseURL}/getUserMaecenates/${userId}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function changeLanguage (lang) {
  return (dispatch) => {
    return axios.put(`${baseURL}/setUserLanguage`, { lng: lang })
      .then(res => res.data)
      .then(res => {
        if (res.success === true) {
          window.location.reload()
        }
      })
  }
}

export function createMaecenatePostSuccess (data) {
  return (dispatch) => {
    dispatch(updateEntities(data.entities))
  }
}

function setPosts (ids, entities) {
  return {
    type: ActionTypes.SET_POSTS,
    ids,
    entities
  }
}

function fetchMaecenatePostsSuccess (data) {
  const ids = data.result
  return setPosts(ids, data.entities)
}

export function fetchMaecenatePosts (slug) {
  return (dispatch) => {
    dispatch(setPosts([], null))
    return axios.get(`${baseURL}/getMaecenatePosts/${slug}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}
/*

export function addPost(post) {
  return {
    type: ActionTypes.ADD_POST,
    name: post.name,
    title: post.title,
    content: post.content,
    slug: post.slug,
    cuid: post.cuid,
    _id: post._id,
  };
}

export function changeSelectedPost(slug) {
  return {
    type: ActionTypes.CHANGE_SELECTED_POST,
    slug,
  };
}

export function addPostRequest(post) {
  return (dispatch) => {
    fetch(`${baseURL}/api/addPost`, {
      method: 'post',
      body: JSON.stringify({
        post: {
          name: post.name,
          title: post.title,
          content: post.content,
        },
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then(res => dispatch(addPost(res.post)));
  };
}

export function addSelectedPost(post) {
  return {
    type: ActionTypes.ADD_SELECTED_POST,
    post,
  };
}

export function getPostRequest(post) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getPost?slug=${post}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json()).then(res => dispatch(addSelectedPost(res.post)));
  };
}

export function deletePost(post) {
  return {
    type: ActionTypes.DELETE_POST,
    post,
  };
}

export function addPosts(posts) {
  return {
    type: ActionTypes.ADD_POSTS,
    posts,
  };
}

export function fetchPosts() {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getPosts`).
      then((response) => response.json()).
      then((response) => dispatch(addPosts(response.posts)));
  };
}

export function deletePostRequest(post) {
  return (dispatch) => {
    fetch(`${baseURL}/api/deletePost`, {
      method: 'post',
      body: JSON.stringify({
        postId: post._id,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(() => dispatch(deletePost(post)));
  };
}
*/
