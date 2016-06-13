import axios from 'axios'

export default function createRequest (url, config) {
  return axios(url, {
    ...config,
    headers: { 'Authorization': `Token ${config.token}` }
  })
}

