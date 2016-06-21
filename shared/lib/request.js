import axios from 'axios'
import { apiURL } from '../config'
import { getAuthToken } from '../selectors/user'

export default function createRequest (url, config) {
  return axios(url, {
    ...config,
    headers: { 'Authorization': `Token ${config.token}` }
  })
}

export function apiRequest (state, url, options) {
  const token = getAuthToken(state())
  return createRequest(apiURL + url, { token, ...options })
    .then(res => res.data)
    .catch(err => console.log(err.stack))
}

